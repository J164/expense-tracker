import type { RecurringTransactionData } from "@/app/lib/types";
import {
    getDueRecurringDates,
    reconcileRecurringTransactions
} from "@/app/lib/server/recurring";
import * as repository from "@/app/lib/server/repository";

describe("recurring service branches", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns no due dates when the next occurrence is after the through date", () => {
        const recurringTransaction: RecurringTransactionData = {
            id: "rt-1",
            userId: "user-1",
            name: "Insurance",
            amountCents: 120000,
            category: "utilities",
            frequency: "YEARLY",
            startDate: "2026-01-15",
            endDate: null,
            isActive: true,
            createdAt: "2026-01-15T00:00:00.000Z",
            updatedAt: "2026-01-15T00:00:00.000Z",
            lastGenerated: "2026-01-15"
        };

        expect(
            getDueRecurringDates(recurringTransaction, "2026-12-31")
        ).toEqual([]);
    });

    it("stops generating dates when the recurring schedule has ended", () => {
        const recurringTransaction: RecurringTransactionData = {
            id: "rt-2",
            userId: "user-1",
            name: "Course",
            amountCents: 1500,
            category: "personal",
            frequency: "MONTHLY",
            startDate: "2026-01-01",
            endDate: "2026-02-15",
            isActive: true,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
            lastGenerated: "2026-02-01"
        };

        expect(
            getDueRecurringDates(recurringTransaction, "2026-04-01")
        ).toEqual([]);
    });

    it("skips updates when no recurring items are due", async () => {
        vi.spyOn(
            repository,
            "listActiveRecurringTransactionsDueForUser"
        ).mockResolvedValue([
            {
                id: "rt-1",
                userId: "user-1",
                name: "Insurance",
                amountCents: 120000,
                category: "utilities",
                frequency: "YEARLY",
                startDate: "2026-01-15",
                endDate: null,
                isActive: true,
                createdAt: "2026-01-15T00:00:00.000Z",
                updatedAt: "2026-01-15T00:00:00.000Z",
                lastGenerated: "2026-01-15"
            }
        ]);
        const createSpy = vi
            .spyOn(repository, "createMaterializedRecurringTransaction")
            .mockResolvedValue(undefined);
        const updateSpy = vi
            .spyOn(repository, "updateRecurringLastGenerated")
            .mockResolvedValue(undefined);

        await expect(
            reconcileRecurringTransactions("user-1", "2026-12-31")
        ).resolves.toEqual({
            insertedTransactions: 0,
            updatedRules: 0
        });

        expect(createSpy).not.toHaveBeenCalled();
        expect(updateSpy).not.toHaveBeenCalled();
    });

    it("projects future occurrences from the rule start date when nothing has been generated yet", async () => {
        const recurringTransaction: RecurringTransactionData = {
            id: "rt-3",
            userId: "user-1",
            name: "Magazine",
            amountCents: 500,
            category: "personal",
            frequency: "MONTHLY",
            startDate: "2026-05-01",
            endDate: "2026-06-15",
            isActive: true,
            createdAt: "2026-05-01T00:00:00.000Z",
            updatedAt: "2026-05-01T00:00:00.000Z",
            lastGenerated: null
        };

        const { getFutureRecurringOccurrences } =
            await import("@/app/lib/server/recurring");

        expect(getFutureRecurringOccurrences(recurringTransaction, 3)).toEqual([
            "2026-05-01",
            "2026-06-01"
        ]);
    });
});
