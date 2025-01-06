import { sql } from "@vercel/postgres";
import { User } from "./definitions";
import { DashboardData } from "./types";

export async function fetchUser(userId: number) {
    try {
        const data = await sql<User>`SELECT * FROM Users WHERE id = ${userId}`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function fetchDashboardData(userId: number) {
    try {
        const data = await sql<DashboardData>`
            WITH 
            MonthlySummary AS (
                SELECT 
                    ms.user_id,
                    ms.budget,
                    ms.total_spent,
                    (ms.budget - ms.total_spent) AS remaining_budget
                FROM Monthly_Summary ms
                WHERE ms.user_id = ${userId}
                    AND DATE_TRUNC('month', ms.month) = DATE_TRUNC('month', CURRENT_DATE)
            ),
            RecentTransactions AS (
                SELECT 
                    t.id AS transaction_id,
                    t.name,
                    t.amount,
                    t.category,
                    t.description,
                    t.purchase_date,
                    t.created_at
                FROM Transactions t
                WHERE t.user_id = ${userId}
                    AND DATE_TRUNC('month', t.purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
                ORDER BY t.purchase_date DESC, t.created_at DESC
                LIMIT 10
            ),
            CategorySpending AS (
                SELECT 
                    t.category,
                    SUM(t.amount) AS total_spent_in_category
                FROM Transactions t
                WHERE t.user_id = ${userId}
                    AND DATE_TRUNC('month', t.purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY t.category
            )
            SELECT 
                ms.budget,
                ms.total_spent,
                ms.remaining_budget,
                (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'transactionId', rt.transaction_id,
                            'name', rt.name,
                            'amount', rt.amount,
                            'category', rt.category,
                            'description', rt.description,
                            'purchaseDate', rt.purchase_date,
                            'createdAt', rt.created_at
                        )
                    )
                    FROM RecentTransactions rt
                ) AS recent_transactions,
                (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'category', cs.category,
                            'totalSpentInCategory', cs.total_spent_in_category
                        )
                    )
                    FROM CategorySpending cs
                ) AS category_spending
            FROM MonthlySummary ms;
        `;

        return data.rows[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch dashboard data.");
    }
}
