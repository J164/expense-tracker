export function normalizeIsoDate(value: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Invalid ISO date: ${value}`);
    }

    return value;
}

export function todayIsoDate(referenceDate: Date = new Date()): string {
    return referenceDate.toISOString().slice(0, 10);
}

export function isoDateToUtcDate(value: string): Date {
    return new Date(`${normalizeIsoDate(value)}T00:00:00.000Z`);
}

export function addMonthsIsoDate(value: string, amount: number): string {
    const date = isoDateToUtcDate(value);
    date.setUTCMonth(date.getUTCMonth() + amount);
    return todayIsoDate(date);
}

export function addYearsIsoDate(value: string, amount: number): string {
    const date = isoDateToUtcDate(value);
    date.setUTCFullYear(date.getUTCFullYear() + amount);
    return todayIsoDate(date);
}

export function compareIsoDate(left: string, right: string): number {
    return normalizeIsoDate(left).localeCompare(normalizeIsoDate(right));
}

export function startOfMonthIsoDate(value: string): string {
    const date = isoDateToUtcDate(value);
    date.setUTCDate(1);
    return todayIsoDate(date);
}

export function endOfMonthIsoDate(value: string): string {
    const date = isoDateToUtcDate(startOfMonthIsoDate(value));
    date.setUTCMonth(date.getUTCMonth() + 1);
    date.setUTCDate(0);
    return todayIsoDate(date);
}

export function isIsoDateInRange(
    value: string,
    startInclusive: string,
    endInclusive: string
): boolean {
    return (
        compareIsoDate(value, startInclusive) >= 0 &&
        compareIsoDate(value, endInclusive) <= 0
    );
}
