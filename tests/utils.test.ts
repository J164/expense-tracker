import { defaultCategories } from "@/app/lib/constants";
import {
    formatDateToLocal,
    formatProfile,
    formatRecurringTransaction,
    formatTransaction,
    generatePagination
} from "@/app/lib/utils";

describe("presentation helpers", () => {
    it("formats dates and pagination windows", () => {
        expect(formatDateToLocal("2026-03-14")).toContain("2026");
        expect(generatePagination(1, 4)).toEqual([1, 2, 3, 4]);
        expect(generatePagination(2, 10)).toEqual([1, 2, 3, "...", 9, 10]);
        expect(generatePagination(9, 10)).toEqual([1, 2, "...", 8, 9, 10]);
        expect(generatePagination(5, 10)).toEqual([
            1,
            "...",
            4,
            5,
            6,
            "...",
            10
        ]);
        expect(defaultCategories).toContain("groceries");
    });

    it("formats transaction, profile, and recurring records", () => {
        expect(
            formatTransaction({
                id: "tx-1",
                userId: "user-1",
                name: "Coffee",
                amountCents: 425,
                purchaseDate: "2026-03-14",
                createdAt: "2026-03-14T12:00:00.000Z",
                category: "dining",
                recurringTransactionId: null
            })
        ).toEqual({
            id: "tx-1",
            name: "Coffee",
            amount: "4.25",
            purchase_date: "2026-03-14",
            created_at: "2026-03-14",
            category: "dining"
        });

        expect(formatProfile({ monthlyBudgetCents: 50000 })).toEqual({
            monthly_budget: "500.00"
        });

        expect(
            formatRecurringTransaction({
                id: "rt-1",
                userId: "user-1",
                name: "Gym",
                amountCents: 3000,
                category: "fitness",
                frequency: "MONTHLY",
                startDate: "2026-01-01",
                endDate: null,
                isActive: true,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
                lastGenerated: "2026-03-01"
            })
        ).toEqual({
            id: "rt-1",
            name: "Gym",
            amount: "30.00",
            category: "fitness",
            frequency: "MONTHLY",
            start_date: "2026-01-01",
            end_date: null,
            is_active: true,
            created_at: "2026-01-01",
            last_generated: "2026-03-01"
        });
    });
});
