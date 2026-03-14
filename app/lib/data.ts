"use server";

import { defaultCategories } from "./constants";
import { requireUserId } from "./session";
import {
    fetchAllUsers as fetchAllUsersFromRepo,
    fetchCardData as fetchCardDataFromRepo,
    fetchFilteredRecurringTransactions as fetchFilteredRecurringTransactionsFromRepo,
    fetchFilteredTransactions as fetchFilteredTransactionsFromRepo,
    fetchProfile as fetchProfileFromRepo,
    fetchRecurringImpactForMonth,
    fetchRecurringTransaction as fetchRecurringTransactionFromRepo,
    fetchRecurringTransactionsPages as fetchRecurringTransactionsPagesFromRepo,
    fetchRecentTransactions as fetchRecentTransactionsFromRepo,
    fetchTransaction as fetchTransactionFromRepo,
    fetchTransactionsPages as fetchTransactionsPagesFromRepo,
    fetchUser as fetchUserFromRepo,
    fetchUserTags as fetchUserTagsFromRepo
} from "./server/repository";
import { reconcileRecurringTransactions } from "./server/recurring";

async function reconcileForCurrentUser() {
    const userId = await requireUserId();
    await reconcileRecurringTransactions(userId);
    return userId;
}

export async function fetchUser() {
    const userId = await requireUserId();
    return fetchUserFromRepo(userId);
}

export async function fetchProfile() {
    const userId = await requireUserId();
    return fetchProfileFromRepo(userId);
}

export async function fetchTransaction(id: string) {
    const userId = await reconcileForCurrentUser();
    return fetchTransactionFromRepo(userId, id);
}

export async function fetchCardData() {
    const userId = await reconcileForCurrentUser();
    const recurringImpactCents = await fetchRecurringImpactForMonth(userId);
    return fetchCardDataFromRepo(userId, recurringImpactCents);
}

export async function fetchRecentTransactions() {
    const userId = await reconcileForCurrentUser();
    return fetchRecentTransactionsFromRepo(userId);
}

export async function fetchFilteredTransactions(
    query: string,
    currentPage: number
) {
    const userId = await reconcileForCurrentUser();
    return fetchFilteredTransactionsFromRepo(userId, query, currentPage);
}

export async function fetchTransactionsPages(query: string) {
    const userId = await reconcileForCurrentUser();
    return fetchTransactionsPagesFromRepo(userId, query);
}

export async function fetchRecurringTransaction(id: string) {
    const userId = await reconcileForCurrentUser();
    return fetchRecurringTransactionFromRepo(userId, id);
}

export async function fetchFilteredRecurringTransactions(
    query: string,
    currentPage: number
) {
    const userId = await reconcileForCurrentUser();
    return fetchFilteredRecurringTransactionsFromRepo(
        userId,
        query,
        currentPage
    );
}

export async function fetchRecurringTransactionsPages(query: string) {
    const userId = await reconcileForCurrentUser();
    return fetchRecurringTransactionsPagesFromRepo(userId, query);
}

export async function fetchUserTags() {
    const userId = await requireUserId();
    return fetchUserTagsFromRepo(userId);
}

export async function fetchAllAvailableTags() {
    const userTags = await fetchUserTags();
    const allTags = [...defaultCategories, ...userTags.map(tag => tag.name)];
    return [...new Set(allTags)].sort();
}

export async function fetchAllUsers() {
    return fetchAllUsersFromRepo();
}
