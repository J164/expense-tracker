export function dollarsToCents(value: number | string): number {
    const numericValue =
        typeof value === "string" ? Number.parseFloat(value) : value;

    if (!Number.isFinite(numericValue)) {
        throw new Error("Invalid currency amount");
    }

    return Math.round(numericValue * 100);
}

export function centsToDollars(value: number): number {
    return value / 100;
}

export function formatCents(value: number): string {
    return centsToDollars(value).toFixed(2);
}
