"use server";

import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "./prisma";
import { getUserId } from "./utils";

export async function fetchUser() {
    const userId = await getUserId();
    const data = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });
    return data;
}

export async function fetchProfile() {
    const userId = await getUserId();
    const data = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
            monthly_budget: true
        }
    });
    return data;
}

export async function fetchTransaction(id: string) {
    const data = await prisma.transaction.findUniqueOrThrow({
        where: { id }
    });
    return data;
}

export async function fetchCardData() {
    const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );
    const nextMonth = new Date(
        new Date(currentMonth).setMonth(currentMonth.getMonth() + 1)
    );

    const userId = await getUserId();

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { monthly_budget: true }
    });

    // Get regular transactions for the current month
    const transactionResult = await prisma.transaction.aggregate({
        where: {
            user_id: userId,
            purchase_date: {
                gte: currentMonth,
                lt: nextMonth
            }
        },
        _sum: {
            amount: true
        }
    });

    // Get active recurring transactions that should impact this month
    const recurringTransactions = await prisma.recurringTransaction.findMany({
        where: {
            user_id: userId,
            is_active: true,
            start_date: { lte: currentMonth },
            OR: [{ end_date: null }, { end_date: { gte: currentMonth } }]
        }
    });

    // Calculate the monthly impact of recurring transactions
    let recurringMonthlyImpact = new Decimal(0);
    for (const recurring of recurringTransactions) {
        if (recurring.frequency === "MONTHLY") {
            recurringMonthlyImpact = recurringMonthlyImpact.add(
                recurring.amount
            );
        } else if (recurring.frequency === "YEARLY") {
            // For yearly transactions, add 1/12 of the amount
            recurringMonthlyImpact = recurringMonthlyImpact.add(
                recurring.amount.div(12)
            );
        }
    }

    const regularTransactionsTotal =
        transactionResult._sum.amount || new Decimal(0);
    const totalSpent = regularTransactionsTotal.add(recurringMonthlyImpact);

    return {
        user_id: userId,
        total_spent: totalSpent,
        budget: user.monthly_budget,
        regular_transactions: regularTransactionsTotal,
        recurring_impact: recurringMonthlyImpact
    };
}

export async function fetchRecentTransactions() {
    const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );

    const userId = await getUserId();
    const data = await prisma.transaction.findMany({
        where: {
            user_id: userId,
            purchase_date: {
                gte: currentMonth,
                lt: new Date(
                    new Date(currentMonth).setMonth(currentMonth.getMonth() + 1)
                )
            }
        },
        orderBy: [{ purchase_date: "desc" }, { created_at: "desc" }],
        take: 10
    });
    return data;
}

const ITEMS_PER_PAGE = 15;
export async function fetchFilteredTransactions(
    query: string,
    currentPage: number
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const userId = await getUserId();
    const data = await prisma.transaction.findMany({
        where: {
            user_id: userId,
            name: { contains: query, mode: "insensitive" }
        },
        orderBy: [{ purchase_date: "desc" }, { created_at: "desc" }],
        take: ITEMS_PER_PAGE,
        skip: offset
    });
    return data;
}

export async function fetchTransactionsPages(query: string) {
    const userId = await getUserId();
    const count = await prisma.transaction.count({
        where: {
            user_id: userId,
            name: { contains: query, mode: "insensitive" }
        }
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function fetchRecurringTransaction(id: string) {
    const data = await prisma.recurringTransaction.findUniqueOrThrow({
        where: { id }
    });
    return data;
}

export async function fetchFilteredRecurringTransactions(
    query: string,
    currentPage: number
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const userId = await getUserId();
    const data = await prisma.recurringTransaction.findMany({
        where: {
            user_id: userId,
            name: { contains: query, mode: "insensitive" }
        },
        orderBy: [{ created_at: "desc" }],
        take: ITEMS_PER_PAGE,
        skip: offset
    });
    return data;
}

export async function fetchRecurringTransactionsPages(query: string) {
    const userId = await getUserId();
    const count = await prisma.recurringTransaction.count({
        where: {
            user_id: userId,
            name: { contains: query, mode: "insensitive" }
        }
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function fetchUserTags() {
    const userId = await getUserId();
    const data = await prisma.userTag.findMany({
        where: { user_id: userId },
        orderBy: { name: "asc" }
    });
    return data;
}

export async function fetchAllAvailableTags() {
    const userTags = await fetchUserTags();
    const { defaultCategories } = await import("./utils");

    // Combine default categories with user custom tags
    const allTags = [...defaultCategories, ...userTags.map(tag => tag.name)];

    // Remove duplicates and sort
    return [...new Set(allTags)].sort();
}
