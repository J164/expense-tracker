export type RecentTransaction = {
    transactionId: number;
    amount: number;
    category: string;
    description: string;
    purchaseDate: string;
    createdAt: string;
};

export type CategorySpending = {
    category: string;
    totalSpentInCategory: number;
};

export type DashboardData = {
    budget: string;
    total_spent: string;
    remaining_budget: string;
    recent_transactions: RecentTransaction[];
    category_spending: CategorySpending[];
};
