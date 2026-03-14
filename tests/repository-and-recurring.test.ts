import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
    createMaterializedRecurringTransaction,
    createRecurringTransaction,
    createTag,
    createTransaction,
    deleteRecurringTransaction,
    deleteTag,
    deleteTransaction,
    fetchAllUsers,
    fetchCardData,
    fetchFilteredRecurringTransactions,
    fetchFilteredTransactions,
    fetchProfile,
    fetchRecurringImpactForMonth,
    fetchRecurringTransaction,
    fetchRecurringTransactionsPages,
    fetchRecentTransactions,
    fetchTransaction,
    fetchTransactionsPages,
    fetchUser,
    fetchUserTags,
    getUserByEmail,
    getUserById,
    listActiveRecurringTransactionsDueForUser,
    toggleRecurringTransactionStatus,
    updateBudget,
    updateRecurringLastGenerated,
    updateRecurringTransaction,
    updateTransaction,
    upsertUser
} from "@/app/lib/server/repository";
import {
    getDueRecurringDates,
    getFutureRecurringOccurrences,
    reconcileAllRecurringTransactions,
    reconcileRecurringTransactions
} from "@/app/lib/server/recurring";
import { resetLocalDatabaseForTesting } from "@/app/lib/server/sql";

async function useTempDatabase() {
    const tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "expense-tracker-")
    );
    process.env.LOCAL_DB_PATH = path.join(tempDir, "test.db");
    await resetLocalDatabaseForTesting();
    return async () => {
        await resetLocalDatabaseForTesting();
        await fs.rm(tempDir, { recursive: true, force: true });
    };
}

describe("repository and recurring integration", () => {
    afterEach(async () => {
        await resetLocalDatabaseForTesting();
        delete process.env.LOCAL_DB_PATH;
    });

    it("supports user, transaction, recurring, and tag flows", async () => {
        const cleanup = await useTempDatabase();

        const createdUser = await upsertUser({
            email: "demo@example.com",
            name: "Demo User",
            image: null,
            providerAccountId: "google-1"
        });
        await upsertUser({
            email: "demo@example.com",
            name: "Updated Demo",
            image: "https://example.com/avatar.png"
        });

        expect(await getUserByEmail("demo@example.com")).toMatchObject({
            id: createdUser.id,
            name: "Updated Demo"
        });
        expect(
            await upsertUser({
                email: "demo@example.com"
            })
        ).toMatchObject({
            id: createdUser.id,
            name: "Updated Demo",
            image: "https://example.com/avatar.png",
            providerAccountId: "google-1"
        });
        expect(await getUserById(createdUser.id)).toMatchObject({
            id: createdUser.id
        });
        expect(await fetchUser(createdUser.id)).toMatchObject({
            image: "https://example.com/avatar.png"
        });

        await updateBudget(createdUser.id, 100000);
        expect(await fetchProfile(createdUser.id)).toEqual({
            monthlyBudgetCents: 100000
        });

        const createdTransaction = await createTransaction({
            userId: createdUser.id,
            name: "Groceries",
            amountCents: 2500,
            purchaseDate: "2026-03-10",
            category: "groceries"
        });

        await createTransaction({
            userId: createdUser.id,
            name: "Dining Out",
            amountCents: 6000,
            purchaseDate: "2026-03-11",
            category: "dining"
        });

        expect(
            await fetchTransaction(createdUser.id, createdTransaction.id)
        ).toMatchObject({
            name: "Groceries"
        });

        await updateTransaction({
            id: createdTransaction.id,
            userId: createdUser.id,
            name: "Groceries Weekly",
            amountCents: 2750,
            purchaseDate: "2026-03-12",
            category: "groceries"
        });

        expect(await fetchRecentTransactions(createdUser.id)).toHaveLength(2);
        expect(
            await fetchFilteredTransactions(createdUser.id, "Dining", 1)
        ).toHaveLength(1);
        expect(await fetchTransactionsPages(createdUser.id, "")).toBe(1);
        expect(await fetchTransactionsPages(createdUser.id, "missing")).toBe(0);

        await createRecurringTransaction({
            userId: createdUser.id,
            name: "Gym",
            amountCents: 3000,
            category: "fitness",
            frequency: "MONTHLY",
            startDate: "2026-01-01",
            endDate: null
        });
        await createRecurringTransaction({
            userId: createdUser.id,
            name: "Insurance",
            amountCents: 120000,
            category: "utilities",
            frequency: "YEARLY",
            startDate: "2026-01-15",
            endDate: null
        });

        const recurringTransactions = await fetchFilteredRecurringTransactions(
            createdUser.id,
            "",
            1
        );
        expect(recurringTransactions).toHaveLength(2);

        const gym = recurringTransactions.find(item => item.name === "Gym");
        expect(gym).toBeTruthy();

        await updateRecurringTransaction({
            id: gym!.id,
            userId: createdUser.id,
            name: "Gym Membership",
            amountCents: 3500,
            category: "fitness",
            frequency: "MONTHLY",
            startDate: "2026-01-01",
            endDate: "2026-12-31"
        });

        expect(
            await fetchRecurringTransaction(createdUser.id, gym!.id)
        ).toMatchObject({
            name: "Gym Membership",
            endDate: "2026-12-31"
        });

        await toggleRecurringTransactionStatus(createdUser.id, gym!.id);
        expect(
            await fetchRecurringTransaction(createdUser.id, gym!.id)
        ).toMatchObject({
            isActive: false
        });
        await toggleRecurringTransactionStatus(createdUser.id, gym!.id);

        expect(await fetchRecurringTransactionsPages(createdUser.id, "")).toBe(
            1
        );
        expect(
            await fetchRecurringTransactionsPages(createdUser.id, "missing")
        ).toBe(0);
        expect(
            await listActiveRecurringTransactionsDueForUser(
                createdUser.id,
                "2026-03-31"
            )
        ).toHaveLength(2);
        expect(
            await fetchRecurringImpactForMonth(createdUser.id, "2026-03-14")
        ).toBe(13500);

        await createTag(createdUser.id, "travel");
        expect(await fetchUserTags(createdUser.id)).toHaveLength(1);
        await expect(createTag(createdUser.id, "travel")).rejects.toThrow(
            "Tag already exists"
        );
        await deleteTag(
            createdUser.id,
            (await fetchUserTags(createdUser.id))[0].id
        );
        await expect(deleteTag(createdUser.id, "missing-tag")).rejects.toThrow(
            "Tag not found"
        );

        const reconciliation = await reconcileRecurringTransactions(
            createdUser.id,
            "2026-03-31"
        );
        expect(reconciliation).toEqual({
            insertedTransactions: 4,
            updatedRules: 2
        });

        const reconciliationAgain = await reconcileRecurringTransactions(
            createdUser.id,
            "2026-03-31"
        );
        expect(reconciliationAgain).toEqual({
            insertedTransactions: 0,
            updatedRules: 0
        });

        const insurance = (
            await fetchFilteredRecurringTransactions(
                createdUser.id,
                "Insurance",
                1
            )
        )[0];
        expect(getDueRecurringDates(insurance, "2027-02-01")).toEqual([
            "2027-01-15"
        ]);
        expect(getFutureRecurringOccurrences(insurance, 2)).toEqual([
            "2027-01-15",
            "2028-01-15"
        ]);
        expect(
            getFutureRecurringOccurrences(
                {
                    ...insurance,
                    endDate: "2026-06-01"
                },
                3
            )
        ).toEqual([]);

        await createRecurringTransaction({
            userId: createdUser.id,
            name: "Future Subscription",
            amountCents: 1500,
            category: "personal",
            frequency: "MONTHLY",
            startDate: "2026-12-01",
            endDate: null
        });
        await createRecurringTransaction({
            userId: createdUser.id,
            name: "Old Membership",
            amountCents: 2200,
            category: "fitness",
            frequency: "MONTHLY",
            startDate: "2025-01-01",
            endDate: "2026-02-01"
        });
        expect(
            await fetchRecurringImpactForMonth(createdUser.id, "2026-03-31")
        ).toBe(13500);

        await updateRecurringLastGenerated(
            createdUser.id,
            insurance.id,
            "2027-01-15"
        );
        await createMaterializedRecurringTransaction({
            recurringTransactionId: insurance.id,
            userId: createdUser.id,
            name: insurance.name,
            amountCents: insurance.amountCents,
            category: insurance.category,
            purchaseDate: "2027-01-15"
        });

        const cardData = await fetchCardData(
            createdUser.id,
            await fetchRecurringImpactForMonth(createdUser.id, "2026-03-31")
        );
        expect(cardData).toEqual({
            totalSpentCents: 25750,
            budgetCents: 100000,
            regularTransactionsCents: 12250,
            recurringImpactCents: 13500
        });

        expect(await fetchAllUsers()).toHaveLength(1);

        await deleteTransaction(createdUser.id, createdTransaction.id);
        await deleteRecurringTransaction(createdUser.id, gym!.id);

        await expect(
            fetchTransaction(createdUser.id, createdTransaction.id)
        ).rejects.toThrow("Transaction not found");
        await expect(
            fetchRecurringTransaction(createdUser.id, gym!.id)
        ).rejects.toThrow("Recurring transaction not found");
        await expect(fetchUser("missing-user")).rejects.toThrow(
            "User not found"
        );

        const secondUser = await upsertUser({
            email: "second@example.com"
        });
        expect(secondUser.name).toBeNull();
        expect(await getUserByEmail("missing@example.com")).toBeNull();
        expect(await fetchCardData(secondUser.id, 0)).toEqual({
            totalSpentCents: 0,
            budgetCents: 0,
            regularTransactionsCents: 0,
            recurringImpactCents: 0
        });
        await createRecurringTransaction({
            userId: secondUser.id,
            name: "Rent",
            amountCents: 200000,
            category: "utilities",
            frequency: "MONTHLY",
            startDate: "2026-03-01",
            endDate: null
        });

        expect(await reconcileAllRecurringTransactions("2026-03-31")).toEqual({
            insertedTransactions: 1,
            updatedRules: 1
        });
        await cleanup();
    });
});
