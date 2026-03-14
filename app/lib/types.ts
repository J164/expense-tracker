export type RecurrenceFrequency = "MONTHLY" | "YEARLY";

export type TransactionRecord = {
    id: string;
    userId: string;
    name: string;
    amountCents: number;
    purchaseDate: string;
    createdAt: string;
    category: string | null;
    recurringTransactionId: string | null;
};

export type FormatTransaction = {
    id: string;
    name: string;
    amount: string;
    purchase_date: string;
    created_at: string;
    category: string | null;
};

export type ProfileData = {
    monthlyBudgetCents: number;
};

export type FormatProfile = {
    monthly_budget: string;
};

export type CardData = {
    totalSpentCents: number;
    budgetCents: number;
    regularTransactionsCents: number;
    recurringImpactCents: number;
};

export type RecurringTransactionData = {
    id: string;
    userId: string;
    name: string;
    amountCents: number;
    category: string | null;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastGenerated: string | null;
};

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

export type UserTag = {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
};

export type UserRecord = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    providerAccountId: string | null;
    monthlyBudgetCents: number;
    createdAt: string;
    updatedAt: string;
};

export type UserUpsertInput = {
    email: string;
    name?: string | null;
    image?: string | null;
    providerAccountId?: string | null;
};
