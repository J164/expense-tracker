import { nanoid } from "nanoid";
import type {
    CardData,
    ProfileData,
    RecurrenceFrequency,
    RecurringTransactionData,
    TransactionRecord,
    UserRecord,
    UserTag,
    UserUpsertInput
} from "@/app/lib/types";
import {
    endOfMonthIsoDate,
    startOfMonthIsoDate,
    todayIsoDate
} from "@/app/lib/dates";
import { getSqlExecutor } from "./sql";

type UserRow = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    provider_account_id: string | null;
    monthly_budget_cents: number;
    created_at: string;
    updated_at: string;
};

type TransactionRow = {
    id: string;
    user_id: string;
    name: string;
    amount_cents: number;
    purchase_date: string;
    created_at: string;
    category: string | null;
    recurring_transaction_id: string | null;
};

type RecurringTransactionRow = {
    id: string;
    user_id: string;
    name: string;
    amount_cents: number;
    category: string | null;
    frequency: RecurrenceFrequency;
    start_date: string;
    end_date: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
    last_generated: string | null;
};

type UserTagRow = {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
};

function mapUser(row: UserRow): UserRecord {
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        image: row.image,
        providerAccountId: row.provider_account_id,
        monthlyBudgetCents: row.monthly_budget_cents,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function mapTransaction(row: TransactionRow): TransactionRecord {
    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        amountCents: row.amount_cents,
        purchaseDate: row.purchase_date,
        createdAt: row.created_at,
        category: row.category,
        recurringTransactionId: row.recurring_transaction_id
    };
}

function mapRecurringTransaction(
    row: RecurringTransactionRow
): RecurringTransactionData {
    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        amountCents: row.amount_cents,
        category: row.category,
        frequency: row.frequency,
        startDate: row.start_date,
        endDate: row.end_date,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastGenerated: row.last_generated
    };
}

function mapUserTag(row: UserTagRow): UserTag {
    return {
        id: row.id,
        name: row.name,
        userId: row.user_id,
        createdAt: row.created_at
    };
}

function nowIsoTimestamp() {
    return new Date().toISOString();
}

const ITEMS_PER_PAGE = 15;

export async function upsertUser(input: UserUpsertInput): Promise<UserRecord> {
    const executor = await getSqlExecutor();
    const existingUser = await executor.first<UserRow>(
        "SELECT * FROM users WHERE email = ?",
        [input.email]
    );

    const timestamp = nowIsoTimestamp();

    if (existingUser) {
        await executor.run(
            `
                UPDATE users
                SET name = ?, image = ?, provider_account_id = COALESCE(?, provider_account_id), updated_at = ?
                WHERE id = ?
            `,
            [
                input.name ?? existingUser.name,
                input.image ?? existingUser.image,
                input.providerAccountId ?? null,
                timestamp,
                existingUser.id
            ]
        );

        return {
            ...mapUser(existingUser),
            name: input.name ?? existingUser.name,
            image: input.image ?? existingUser.image,
            providerAccountId:
                input.providerAccountId ?? existingUser.provider_account_id,
            updatedAt: timestamp
        };
    }

    const user: UserRecord = {
        id: nanoid(),
        email: input.email,
        name: input.name ?? null,
        image: input.image ?? null,
        providerAccountId: input.providerAccountId ?? null,
        monthlyBudgetCents: 0,
        createdAt: timestamp,
        updatedAt: timestamp
    };

    await executor.run(
        `
            INSERT INTO users (
                id, email, name, image, provider_account_id,
                monthly_budget_cents, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user.id,
            user.email,
            user.name,
            user.image,
            user.providerAccountId,
            user.monthlyBudgetCents,
            user.createdAt,
            user.updatedAt
        ]
    );

    return user;
}

export async function getUserByEmail(email: string) {
    const executor = await getSqlExecutor();
    const user = await executor.first<UserRow>(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return user ? mapUser(user) : null;
}

export async function getUserById(userId: string) {
    const executor = await getSqlExecutor();
    const user = await executor.first<UserRow>(
        "SELECT * FROM users WHERE id = ?",
        [userId]
    );
    return user ? mapUser(user) : null;
}

export async function fetchUser(userId: string) {
    const user = await getUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function fetchProfile(userId: string): Promise<ProfileData> {
    const user = await fetchUser(userId);
    return { monthlyBudgetCents: user.monthlyBudgetCents };
}

export async function updateBudget(userId: string, monthlyBudgetCents: number) {
    const executor = await getSqlExecutor();
    await executor.run(
        `
            UPDATE users
            SET monthly_budget_cents = ?, updated_at = ?
            WHERE id = ?
        `,
        [monthlyBudgetCents, nowIsoTimestamp(), userId]
    );
}

export async function createTransaction(input: {
    userId: string;
    name: string;
    amountCents: number;
    purchaseDate: string;
    category: string | null;
    recurringTransactionId?: string | null;
}) {
    const executor = await getSqlExecutor();
    const transactionId = nanoid();

    await executor.run(
        `
            INSERT INTO transactions (
                id, user_id, amount_cents, category, purchase_date,
                created_at, name, recurring_transaction_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            transactionId,
            input.userId,
            input.amountCents,
            input.category,
            input.purchaseDate,
            nowIsoTimestamp(),
            input.name,
            input.recurringTransactionId ?? null
        ]
    );

    return fetchTransaction(input.userId, transactionId);
}

export async function updateTransaction(input: {
    id: string;
    userId: string;
    name: string;
    amountCents: number;
    purchaseDate: string;
    category: string | null;
}) {
    const executor = await getSqlExecutor();
    await executor.run(
        `
            UPDATE transactions
            SET name = ?, amount_cents = ?, purchase_date = ?, category = ?
            WHERE id = ? AND user_id = ?
        `,
        [
            input.name,
            input.amountCents,
            input.purchaseDate,
            input.category,
            input.id,
            input.userId
        ]
    );
}

export async function deleteTransaction(userId: string, transactionId: string) {
    const executor = await getSqlExecutor();
    await executor.run(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [transactionId, userId]
    );
}

export async function fetchTransaction(userId: string, transactionId: string) {
    const executor = await getSqlExecutor();
    const transaction = await executor.first<TransactionRow>(
        "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
        [transactionId, userId]
    );

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    return mapTransaction(transaction);
}

export async function fetchRecentTransactions(userId: string) {
    const executor = await getSqlExecutor();
    const today = todayIsoDate();
    const monthStart = startOfMonthIsoDate(today);
    const monthEnd = endOfMonthIsoDate(today);
    const rows = await executor.all<TransactionRow>(
        `
            SELECT * FROM transactions
            WHERE user_id = ? AND purchase_date BETWEEN ? AND ?
            ORDER BY purchase_date DESC, created_at DESC
            LIMIT 10
        `,
        [userId, monthStart, monthEnd]
    );

    return rows.map(mapTransaction);
}

export async function fetchFilteredTransactions(
    userId: string,
    query: string,
    currentPage: number
) {
    const executor = await getSqlExecutor();
    const rows = await executor.all<TransactionRow>(
        `
            SELECT * FROM transactions
            WHERE user_id = ? AND name LIKE ?
            ORDER BY purchase_date DESC, created_at DESC
            LIMIT ? OFFSET ?
        `,
        [
            userId,
            `%${query}%`,
            ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE
        ]
    );

    return rows.map(mapTransaction);
}

export async function fetchTransactionsPages(userId: string, query: string) {
    const executor = await getSqlExecutor();
    const result = (await executor.first<{ count: number }>(
        "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND name LIKE ?",
        [userId, `%${query}%`]
    )) as { count: number };

    return Math.ceil(result.count / ITEMS_PER_PAGE);
}

export async function createRecurringTransaction(input: {
    userId: string;
    name: string;
    amountCents: number;
    category: string | null;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate: string | null;
}) {
    const executor = await getSqlExecutor();
    const recurringId = nanoid();
    const timestamp = nowIsoTimestamp();

    await executor.run(
        `
            INSERT INTO recurring_transactions (
                id, user_id, name, amount_cents, category, frequency,
                start_date, end_date, is_active, created_at, updated_at, last_generated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NULL)
        `,
        [
            recurringId,
            input.userId,
            input.name,
            input.amountCents,
            input.category,
            input.frequency,
            input.startDate,
            input.endDate,
            timestamp,
            timestamp
        ]
    );
}

export async function updateRecurringTransaction(input: {
    id: string;
    userId: string;
    name: string;
    amountCents: number;
    category: string | null;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate: string | null;
}) {
    const executor = await getSqlExecutor();
    await executor.run(
        `
            UPDATE recurring_transactions
            SET name = ?, amount_cents = ?, category = ?, frequency = ?,
                start_date = ?, end_date = ?, updated_at = ?
            WHERE id = ? AND user_id = ?
        `,
        [
            input.name,
            input.amountCents,
            input.category,
            input.frequency,
            input.startDate,
            input.endDate,
            nowIsoTimestamp(),
            input.id,
            input.userId
        ]
    );
}

export async function toggleRecurringTransactionStatus(
    userId: string,
    recurringTransactionId: string
) {
    const recurringTransaction = await fetchRecurringTransaction(
        userId,
        recurringTransactionId
    );
    const executor = await getSqlExecutor();

    await executor.run(
        `
            UPDATE recurring_transactions
            SET is_active = ?, updated_at = ?
            WHERE id = ? AND user_id = ?
        `,
        [
            recurringTransaction.isActive ? 0 : 1,
            nowIsoTimestamp(),
            recurringTransactionId,
            userId
        ]
    );
}

export async function deleteRecurringTransaction(
    userId: string,
    recurringTransactionId: string
) {
    const executor = await getSqlExecutor();
    await executor.run(
        "DELETE FROM recurring_transactions WHERE id = ? AND user_id = ?",
        [recurringTransactionId, userId]
    );
}

export async function fetchRecurringTransaction(
    userId: string,
    recurringTransactionId: string
) {
    const executor = await getSqlExecutor();
    const recurringTransaction = await executor.first<RecurringTransactionRow>(
        "SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?",
        [recurringTransactionId, userId]
    );

    if (!recurringTransaction) {
        throw new Error("Recurring transaction not found");
    }

    return mapRecurringTransaction(recurringTransaction);
}

export async function fetchFilteredRecurringTransactions(
    userId: string,
    query: string,
    currentPage: number
) {
    const executor = await getSqlExecutor();
    const rows = await executor.all<RecurringTransactionRow>(
        `
            SELECT * FROM recurring_transactions
            WHERE user_id = ? AND name LIKE ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `,
        [
            userId,
            `%${query}%`,
            ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE
        ]
    );

    return rows.map(mapRecurringTransaction);
}

export async function fetchRecurringTransactionsPages(
    userId: string,
    query: string
) {
    const executor = await getSqlExecutor();
    const result = (await executor.first<{ count: number }>(
        "SELECT COUNT(*) as count FROM recurring_transactions WHERE user_id = ? AND name LIKE ?",
        [userId, `%${query}%`]
    )) as { count: number };

    return Math.ceil(result.count / ITEMS_PER_PAGE);
}

export async function fetchUserTags(userId: string) {
    const executor = await getSqlExecutor();
    const rows = await executor.all<UserTagRow>(
        "SELECT * FROM user_tags WHERE user_id = ? ORDER BY name ASC",
        [userId]
    );
    return rows.map(mapUserTag);
}

export async function createTag(userId: string, name: string) {
    const executor = await getSqlExecutor();
    const normalizedName = name.toLowerCase();
    const existing = await executor.first<UserTagRow>(
        "SELECT * FROM user_tags WHERE user_id = ? AND name = ?",
        [userId, normalizedName]
    );

    if (existing) {
        throw new Error("Tag already exists");
    }

    await executor.run(
        "INSERT INTO user_tags (id, user_id, name, created_at) VALUES (?, ?, ?, ?)",
        [nanoid(), userId, normalizedName, nowIsoTimestamp()]
    );
}

export async function deleteTag(userId: string, tagId: string) {
    const executor = await getSqlExecutor();
    const existing = await executor.first<UserTagRow>(
        "SELECT * FROM user_tags WHERE id = ? AND user_id = ?",
        [tagId, userId]
    );

    if (!existing) {
        throw new Error("Tag not found");
    }

    await executor.run("DELETE FROM user_tags WHERE id = ?", [tagId]);
}

export async function fetchAllUsers() {
    const executor = await getSqlExecutor();
    const rows = await executor.all<UserRow>(
        "SELECT * FROM users ORDER BY created_at ASC"
    );
    return rows.map(mapUser);
}

export async function listActiveRecurringTransactionsDueForUser(
    userId: string,
    throughDate: string
) {
    const executor = await getSqlExecutor();
    const rows = await executor.all<RecurringTransactionRow>(
        `
            SELECT * FROM recurring_transactions
            WHERE user_id = ?
              AND is_active = 1
              AND start_date <= ?
              AND (end_date IS NULL OR end_date >= ?)
            ORDER BY start_date ASC, created_at ASC
        `,
        [userId, throughDate, throughDate]
    );

    return rows.map(mapRecurringTransaction);
}

export async function createMaterializedRecurringTransaction(input: {
    recurringTransactionId: string;
    userId: string;
    name: string;
    amountCents: number;
    category: string | null;
    purchaseDate: string;
}) {
    const executor = await getSqlExecutor();
    await executor.run(
        `
            INSERT OR IGNORE INTO transactions (
                id, user_id, amount_cents, category, purchase_date,
                created_at, name, recurring_transaction_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            nanoid(),
            input.userId,
            input.amountCents,
            input.category,
            input.purchaseDate,
            nowIsoTimestamp(),
            input.name,
            input.recurringTransactionId
        ]
    );
}

export async function updateRecurringLastGenerated(
    userId: string,
    recurringTransactionId: string,
    lastGenerated: string
) {
    const executor = await getSqlExecutor();
    await executor.run(
        `
            UPDATE recurring_transactions
            SET last_generated = ?, updated_at = ?
            WHERE id = ? AND user_id = ?
        `,
        [lastGenerated, nowIsoTimestamp(), recurringTransactionId, userId]
    );
}

export async function fetchCardData(
    userId: string,
    recurringImpactCents: number
): Promise<CardData> {
    const executor = await getSqlExecutor();
    const today = todayIsoDate();
    const monthStart = startOfMonthIsoDate(today);
    const monthEnd = endOfMonthIsoDate(today);

    const user = await fetchUser(userId);
    const total = await executor.first<{ total: number | null }>(
        `
            SELECT SUM(amount_cents) as total
            FROM transactions
            WHERE user_id = ? AND purchase_date BETWEEN ? AND ?
        `,
        [userId, monthStart, monthEnd]
    );

    const regularTransactionsCents = total?.total ?? 0;

    return {
        totalSpentCents: regularTransactionsCents + recurringImpactCents,
        budgetCents: user.monthlyBudgetCents,
        regularTransactionsCents,
        recurringImpactCents
    };
}

export async function fetchRecurringImpactForMonth(
    userId: string,
    month: string = todayIsoDate()
) {
    const recurringTransactions =
        await listActiveRecurringTransactionsDueForUser(
            userId,
            endOfMonthIsoDate(month)
        );

    return recurringTransactions.reduce((total, transaction) => {
        if (transaction.frequency === "MONTHLY") {
            return total + transaction.amountCents;
        }

        return total + Math.round(transaction.amountCents / 12);
    }, 0);
}
