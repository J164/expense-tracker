import {
    addMonthsIsoDate,
    addYearsIsoDate,
    compareIsoDate,
    endOfMonthIsoDate,
    isIsoDateInRange,
    isoDateToUtcDate,
    normalizeIsoDate,
    startOfMonthIsoDate,
    todayIsoDate
} from "@/app/lib/dates";

describe("date helpers", () => {
    it("normalizes and compares ISO dates", () => {
        expect(normalizeIsoDate("2026-03-14")).toBe("2026-03-14");
        expect(compareIsoDate("2026-03-14", "2026-03-15")).toBeLessThan(0);
        expect(() => normalizeIsoDate("03/14/2026")).toThrow(
            "Invalid ISO date"
        );
    });

    it("creates month and year ranges", () => {
        expect(todayIsoDate(new Date("2026-03-14T12:00:00.000Z"))).toBe(
            "2026-03-14"
        );
        expect(isoDateToUtcDate("2026-03-14").toISOString()).toBe(
            "2026-03-14T00:00:00.000Z"
        );
        expect(addMonthsIsoDate("2026-01-31", 1)).toBe("2026-03-03");
        expect(addYearsIsoDate("2024-02-29", 1)).toBe("2025-03-01");
        expect(startOfMonthIsoDate("2026-03-14")).toBe("2026-03-01");
        expect(endOfMonthIsoDate("2026-02-14")).toBe("2026-02-28");
        expect(isIsoDateInRange("2026-03-14", "2026-03-01", "2026-03-31")).toBe(
            true
        );
        expect(isIsoDateInRange("2026-04-01", "2026-03-01", "2026-03-31")).toBe(
            false
        );
    });
});
