import { Decimal } from "@prisma/client/runtime/library";

export type FormatTransaction = {
    id: string;
    name: string;
    amount: string;
    purchase_date: string;
    created_at: string;
    category: string | null;
};

export type ProfileData = {
    monthly_budget: Decimal;
};

export type FormatProfile = {
    monthly_budget: string;
};

export type RecurrenceFrequency = "MONTHLY" | "YEARLY";

export type FormatRecurringTransaction = {
    id: string;
    name: string;
    amount: string;
    category: string | null;
    frequency: RecurrenceFrequency;
    start_date: string;
    end_date: string | null;
    is_active: boolean;
    created_at: string;
    last_generated: string | null;
};

export type RecurringTransactionData = {
    id: string;
    name: string;
    amount: Decimal;
    category: string | null;
    frequency: RecurrenceFrequency;
    start_date: Date;
    end_date: Date | null;
    is_active: boolean;
    created_at: Date;
    last_generated: Date | null;
};

export type UserTag = {
    id: string;
    name: string;
    user_id: string;
    created_at: Date;
};
