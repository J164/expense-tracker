import { sql } from "@vercel/postgres";
import { User } from "./definitions";
import { CardData, RecentTransaction } from "./types";

export async function fetchUser(userId: number) {
    try {
        const data = await sql<User>`SELECT * FROM Users WHERE id = ${userId}`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function fetchCardData(userId: number) {
    try {
        const data = await sql<CardData>`
            SELECT 
                ms.user_id,
                ms.budget,
                ms.total_spent,
                (ms.budget - ms.total_spent) AS remaining_budget
            FROM Monthly_Summary ms
            WHERE ms.user_id = ${userId}
                AND DATE_TRUNC('month', ms.month) = DATE_TRUNC('month', CURRENT_DATE)`;

        return data.rows[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchRecentTransactions(userId: number) {
    try {
        const data = await sql<RecentTransaction>`
            SELECT 
                t.id,
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
            LIMIT 10`;

        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch recent transactions.");
    }
}
