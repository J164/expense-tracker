import { formatCents } from "./currency";
import type {
    FormatProfile,
    FormatRecurringTransaction,
    FormatTransaction,
    ProfileData,
    RecurringTransactionData,
    TransactionRecord
} from "./types";

export const formatDateToLocal = (
    dateStr: string,
    locale: string = "en-US"
) => {
    const date = new Date(`${dateStr}T00:00:00.000Z`);
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

export function formatTransaction(
    transaction: TransactionRecord
): FormatTransaction {
    return {
        id: transaction.id,
        name: transaction.name,
        amount: formatCents(transaction.amountCents),
        purchase_date: transaction.purchaseDate,
        created_at: transaction.createdAt.slice(0, 10),
        category: transaction.category
    };
}

export function formatProfile(profile: ProfileData): FormatProfile {
    return {
        monthly_budget: formatCents(profile.monthlyBudgetCents)
    };
}

export function formatRecurringTransaction(
    recurringTransaction: RecurringTransactionData
): FormatRecurringTransaction {
    return {
        id: recurringTransaction.id,
        name: recurringTransaction.name,
        amount: formatCents(recurringTransaction.amountCents),
        category: recurringTransaction.category,
        frequency: recurringTransaction.frequency,
        start_date: recurringTransaction.startDate,
        end_date: recurringTransaction.endDate,
        is_active: recurringTransaction.isActive,
        created_at: recurringTransaction.createdAt.slice(0, 10),
        last_generated: recurringTransaction.lastGenerated
    };
}
