import {
    centsToDollars,
    dollarsToCents,
    formatCents
} from "@/app/lib/currency";

describe("currency helpers", () => {
    it("converts dollars to cents and back", () => {
        expect(dollarsToCents(12.34)).toBe(1234);
        expect(dollarsToCents("0.99")).toBe(99);
        expect(centsToDollars(250)).toBe(2.5);
        expect(formatCents(250)).toBe("2.50");
    });

    it("throws on invalid currency input", () => {
        expect(() => dollarsToCents("wat")).toThrow("Invalid currency amount");
    });
});
