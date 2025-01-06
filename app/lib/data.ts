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
                    p.id AS transaction_id,
                    p.amount,
                    p.category,
                    p.description,
                    p.purchase_date,
                    p.created_at
                FROM Purchases p
                WHERE p.user_id = ${userId}
                    AND DATE_TRUNC('month', p.purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
                ORDER BY p.purchase_date DESC, p.created_at DESC
                LIMIT 10
            ),
            CategorySpending AS (
                SELECT 
                    p.category,
                    SUM(p.amount) AS total_spent_in_category
                FROM Purchases p
                WHERE p.user_id = ${userId}
                    AND DATE_TRUNC('month', p.purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY p.category
            )
            SELECT 
                ms.budget,
                ms.total_spent,
                ms.remaining_budget,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'transaction_id', rt.transaction_id,
                        'amount', rt.amount,
                        'category', rt.category,
                        'description', rt.description,
                        'purchase_date', rt.purchase_date,
                        'created_at', rt.created_at
                    )
                ) FILTER (WHERE rt.transaction_id IS NOT NULL) AS recent_transactions,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                    'category', cs.category,
                    'total_spent_in_category', cs.total_spent_in_category
                    )
                ) FILTER (WHERE cs.category IS NOT NULL) AS category_spending
                FROM MonthlySummary ms
                LEFT JOIN RecentTransactions rt ON TRUE
                LEFT JOIN CategorySpending cs ON TRUE
        `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch dashboard data.");
    }
}
