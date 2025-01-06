export type RecentTransaction = {
    id: number;
    name: string;
    amount: string;
    category: string;
    description: string;
    purchase_date: string;
    created_at: string;
};

export type CardData = {
    budget: string;
    total_spent: string;
    remaining_budget: string;
};

export type FilteredTransaction = {
    id: number;
    name: string;
    amount: string;
    category: string;
    description: string;
    purchase_date: string;
    created_at: string;
};
