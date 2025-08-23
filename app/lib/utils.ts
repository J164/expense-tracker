import { auth } from "@/auth";
import { Transaction } from "@prisma/client";
import { FormatProfile, FormatTransaction, ProfileData } from "./types";

export const defaultCategories = ["Dining", "Entertainment"];

export async function getUserId() {
    const session = await auth();
    return session!.user!.id!;
}

export const formatDateToLocal = (
    dateStr: string,
    locale: string = "en-US"
) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
    ];
};

export function formatTransaction(transaction: Transaction): FormatTransaction {
    return {
        ...transaction,
        amount: transaction.amount.toFixed(2),
        purchase_date: transaction.purchase_date.toISOString().split("T")[0],
        created_at: transaction.created_at.toISOString().split("T")[0]
    };
}

export function formatProfile(profile: ProfileData): FormatProfile {
    return {
        monthly_budget: profile.monthly_budget.toFixed(2)
    };
}
