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
            default_budget: true
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

    const userId = await getUserId();
    const data = await prisma.monthlySummary.findFirst({
        where: {
            user_id: userId,
            month: {
                gte: currentMonth,
                lt: new Date(
                    new Date(currentMonth).setMonth(currentMonth.getMonth() + 1)
                )
            }
        },
        select: {
            id: true,
            user_id: true,
            budget: true,
            total_spent: true
        }
    });

    if (!data) {
        const data = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: { default_budget: true }
        });
        return {
            id: null,
            user_id: userId,
            total_spent: new Decimal(0),
            budget: data.default_budget
        };
    }

    return data;
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
