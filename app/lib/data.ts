import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "./prisma";

export async function fetchUser(userId: number) {
    try {
        const data = await prisma.users.findUniqueOrThrow({
            where: { id: userId }
        });
        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function fetchCardData(userId: number) {
    const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );

    try {
        const data = await prisma.monthly_summary.findFirst({
            where: {
                user_id: userId,
                month: {
                    gte: currentMonth,
                    lt: new Date(
                        new Date(currentMonth).setMonth(
                            currentMonth.getMonth() + 1
                        )
                    )
                }
            },
            select: {
                user_id: true,
                budget: true,
                total_spent: true
            }
        });

        if (!data) {
            const data = await prisma.users.findUniqueOrThrow({
                where: { id: userId },
                select: { default_budget: true }
            });
            return {
                user_id: userId,
                total_spent: new Decimal(0),
                budget: data.default_budget
            };
        }

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchRecentTransactions(userId: number) {
    const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );

    try {
        const data = await prisma.transactions.findMany({
            where: {
                user_id: userId,
                purchase_date: {
                    gte: currentMonth,
                    lt: new Date(
                        new Date(currentMonth).setMonth(
                            currentMonth.getMonth() + 1
                        )
                    )
                }
            },
            orderBy: [{ purchase_date: "desc" }, { created_at: "desc" }],
            take: 10
        });
        return data;
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
        const data = await prisma.transactions.findMany({
            where: {
                name: { contains: query, mode: "insensitive" }
            },
            orderBy: [{ purchase_date: "desc" }, { created_at: "desc" }],
            take: ITEMS_PER_PAGE,
            skip: offset
        });
        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch transactions.");
    }
}

export async function fetchTransactionsPages(query: string) {
    try {
        const count = await prisma.transactions.count({
            where: {
                name: { contains: query, mode: "insensitive" }
            }
        });
        return Math.ceil(count / ITEMS_PER_PAGE);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of transactions.");
    }
}
