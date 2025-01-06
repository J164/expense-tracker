// index on purchase_date, user_id, category in Purchase table

export type User = {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: Date;
};

export type Category = {
    id: number;
    user_id: number;
    name: string;
    created_at: Date;
};

export type Transaction = {
    id: number;
    user_id: number;
    name: string;
    amount: number;
    category: string;
    description: string;
    transaction_date: Date;
    created_at: Date;
};

export type MonthlySummary = {
    id: number;
    user_id: number;
    month: Date;
    budget: number;
    total_spent: number;
    total_recieved: number;
    created_at: Date;
};

export type UserWithDetails = User & {
    categories: Category[];
    transactions: Transaction[];
    monthlySummaries: MonthlySummary[];
};
