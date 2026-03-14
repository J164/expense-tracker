import {
    addMonthsIsoDate,
    addYearsIsoDate,
    compareIsoDate,
    todayIsoDate
} from "@/app/lib/dates";
import type {
    RecurrenceFrequency,
    RecurringTransactionData
} from "@/app/lib/types";
import {
    createMaterializedRecurringTransaction,
    fetchAllUsers,
    listActiveRecurringTransactionsDueForUser,
    updateRecurringLastGenerated
} from "./repository";

function getNextOccurrence(date: string, frequency: RecurrenceFrequency) {
    return frequency === "MONTHLY"
        ? addMonthsIsoDate(date, 1)
        : addYearsIsoDate(date, 1);
}

export function getDueRecurringDates(
    recurringTransaction: RecurringTransactionData,
    throughDate: string
) {
    const dueDates: string[] = [];
    let candidate = recurringTransaction.lastGenerated
        ? getNextOccurrence(
              recurringTransaction.lastGenerated,
              recurringTransaction.frequency
          )
        : recurringTransaction.startDate;

    while (compareIsoDate(candidate, throughDate) <= 0) {
        if (
            recurringTransaction.endDate &&
            compareIsoDate(candidate, recurringTransaction.endDate) > 0
        ) {
            break;
        }

        dueDates.push(candidate);
        candidate = getNextOccurrence(
            candidate,
            recurringTransaction.frequency
        );
    }

    return dueDates;
}

export async function reconcileRecurringTransactions(
    userId: string,
    throughDate: string = todayIsoDate()
) {
    const recurringTransactions =
        await listActiveRecurringTransactionsDueForUser(userId, throughDate);

    let insertedTransactions = 0;
    let updatedRules = 0;

    for (const recurringTransaction of recurringTransactions) {
        const dueDates = getDueRecurringDates(
            recurringTransaction,
            throughDate
        );

        if (dueDates.length === 0) {
            continue;
        }

        for (const dueDate of dueDates) {
            await createMaterializedRecurringTransaction({
                recurringTransactionId: recurringTransaction.id,
                userId: recurringTransaction.userId,
                name: recurringTransaction.name,
                amountCents: recurringTransaction.amountCents,
                category: recurringTransaction.category,
                purchaseDate: dueDate
            });
            insertedTransactions += 1;
        }

        await updateRecurringLastGenerated(
            recurringTransaction.userId,
            recurringTransaction.id,
            dueDates[dueDates.length - 1]
        );
        updatedRules += 1;
    }

    return { insertedTransactions, updatedRules };
}

export async function reconcileAllRecurringTransactions(
    throughDate: string = todayIsoDate()
) {
    const users = await fetchAllUsers();
    let insertedTransactions = 0;
    let updatedRules = 0;

    for (const user of users) {
        const result = await reconcileRecurringTransactions(
            user.id,
            throughDate
        );
        insertedTransactions += result.insertedTransactions;
        updatedRules += result.updatedRules;
    }

    return { insertedTransactions, updatedRules };
}

export function getFutureRecurringOccurrences(
    recurringTransaction: RecurringTransactionData,
    count: number
) {
    const occurrences: string[] = [];
    let candidate = recurringTransaction.lastGenerated
        ? getNextOccurrence(
              recurringTransaction.lastGenerated,
              recurringTransaction.frequency
          )
        : recurringTransaction.startDate;

    while (occurrences.length < count) {
        if (
            recurringTransaction.endDate &&
            compareIsoDate(candidate, recurringTransaction.endDate) > 0
        ) {
            break;
        }

        occurrences.push(candidate);
        candidate = getNextOccurrence(
            candidate,
            recurringTransaction.frequency
        );
    }

    return occurrences;
}
