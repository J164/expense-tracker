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
    budget: number;
    totalSpent: number;
    remainingBudget: number;
    recentTransactions: RecentTransaction[];
    categorySpending: CategorySpending[];
};
