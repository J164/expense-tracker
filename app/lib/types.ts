export type RecentTransaction = {
    id: number;
    name: string;
    amount: string;
    category: string;
    description: string;
    purchaseDate: string;
    createdAt: string;
};

export type CardData = {
    budget: string;
    total_spent: string;
    remaining_budget: string;
};
