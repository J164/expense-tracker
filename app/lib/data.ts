import { sql } from "@vercel/postgres";
import { Category, User } from "./definitions";
import { CardData, FilteredTransaction, RecentTransaction } from "./types";

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

const ITEMS_PER_PAGE = 15;
export async function fetchFilteredTransactions(
    query: string,
    currentPage: number
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const transactions = await sql<FilteredTransaction>`
            SELECT 
                t.id,
                t.name,
                t.amount,
                t.category,
                t.description,
                t.purchase_date,
                t.created_at
            FROM Transactions t
            WHERE
                t.name ILIKE ${`%${query}%`} OR
                t.description ILIKE ${`%${query}%`}
            ORDER BY t.purchase_date DESC, t.created_at DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

        return transactions.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch transactions.");
    }
}

export async function fetchTransactionsPages(query: string) {
    try {
        const count = await sql`SELECT COUNT(*)
            FROM Transactions t
            WHERE
                t.name ILIKE ${`%${query}%`} OR
                t.description ILIKE ${`%${query}%`}`;

        const totalPages = Math.ceil(
            Number(count.rows[0].count) / ITEMS_PER_PAGE
        );
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of transactions.");
    }
}

export async function fetchCategories(userId: number) {
    try {
        const data = await sql<Category>`
            SELECT * FROM Categories WHERE id = ${userId}`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of transactions.");
    }
}
