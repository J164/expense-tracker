"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { dollarsToCents } from "../currency";
import type { RecurrenceFrequency } from "../types";
import {
    createRecurringTransaction as createRecurringTransactionInRepo,
    deleteRecurringTransaction as deleteRecurringTransactionInRepo,
    toggleRecurringTransactionStatus as toggleRecurringTransactionStatusInRepo,
    updateRecurringTransaction as updateRecurringTransactionInRepo
} from "../server/repository";
import { requireUserId } from "../session";

const RecurringTransactionSchema = z.object({
    name: z.string().trim().min(1),
    amount: z.coerce.number(),
    start_date: z.string(),
    end_date: z.string().optional(),
    category: z.string().nullish(),
    frequency: z.enum(["MONTHLY", "YEARLY"])
});

export async function createRecurringTransaction(formData: FormData) {
    const userId = await requireUserId();
    const { name, amount, start_date, end_date, category, frequency } =
        RecurringTransactionSchema.parse({
            name: formData.get("name"),
            amount: formData.get("amount"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date") || undefined,
            category: formData.get("category"),
            frequency: formData.get("frequency")
        });

    await createRecurringTransactionInRepo({
        userId,
        name,
        amountCents: dollarsToCents(amount),
        category: category || null,
        frequency: frequency as RecurrenceFrequency,
        startDate: start_date,
        endDate: end_date || null
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/recurring");
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/recurring");
}

export async function updateRecurringTransaction(
    id: string,
    formData: FormData
) {
    const userId = await requireUserId();
    const { name, amount, start_date, end_date, category, frequency } =
        RecurringTransactionSchema.parse({
            name: formData.get("name"),
            amount: formData.get("amount"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date") || undefined,
            category: formData.get("category"),
            frequency: formData.get("frequency")
        });

    await updateRecurringTransactionInRepo({
        id,
        userId,
        name,
        amountCents: dollarsToCents(amount),
        category: category || null,
        frequency: frequency as RecurrenceFrequency,
        startDate: start_date,
        endDate: end_date || null
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/recurring");
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/recurring");
}

export async function deleteRecurringTransaction(id: string) {
    const userId = await requireUserId();
    await deleteRecurringTransactionInRepo(userId, id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/recurring");
    revalidatePath("/dashboard/transactions");
}

export async function toggleRecurringTransactionStatus(id: string) {
    const userId = await requireUserId();
    await toggleRecurringTransactionStatusInRepo(userId, id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/recurring");
    revalidatePath("/dashboard/transactions");
}
