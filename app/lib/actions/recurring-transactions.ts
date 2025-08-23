"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "../prisma";
import { getUserId } from "../utils";
import { RecurrenceFrequency } from "../types";

const RecurringTransactionSchema = z.object({
    name: z.string(),
    amount: z.coerce.number(),
    start_date: z.string(),
    end_date: z.string().optional(),
    category: z.string().nullish(),
    frequency: z.enum(["MONTHLY", "YEARLY"])
});

export async function createRecurringTransaction(formData: FormData) {
    const userId = await getUserId();
    const { name, amount, start_date, end_date, category, frequency } =
        RecurringTransactionSchema.parse({
            name: formData.get("name"),
            amount: formData.get("amount"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date") || undefined,
            category: formData.get("category"),
            frequency: formData.get("frequency")
        });

    await prisma.recurringTransaction.create({
        data: {
            user_id: userId,
            name,
            amount,
            category,
            frequency: frequency as RecurrenceFrequency,
            start_date: new Date(start_date),
            end_date: end_date ? new Date(end_date) : null,
            created_at: new Date()
        }
    });

    revalidatePath("/dashboard/recurring");
    redirect("/dashboard/recurring");
}

export async function updateRecurringTransaction(
    id: string,
    formData: FormData
) {
    const userId = await getUserId();
    const { name, amount, start_date, end_date, category, frequency } =
        RecurringTransactionSchema.parse({
            name: formData.get("name"),
            amount: formData.get("amount"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date") || undefined,
            category: formData.get("category"),
            frequency: formData.get("frequency")
        });

    await prisma.recurringTransaction.update({
        where: { id, user_id: userId },
        data: {
            name,
            amount,
            category,
            frequency: frequency as RecurrenceFrequency,
            start_date: new Date(start_date),
            end_date: end_date ? new Date(end_date) : null
        }
    });

    revalidatePath("/dashboard/recurring");
    redirect("/dashboard/recurring");
}

export async function deleteRecurringTransaction(id: string) {
    const userId = await getUserId();
    await prisma.recurringTransaction.delete({
        where: { id, user_id: userId }
    });
    revalidatePath("/dashboard/recurring");
}

export async function toggleRecurringTransactionStatus(id: string) {
    const userId = await getUserId();

    const recurringTransaction = await prisma.recurringTransaction.findFirst({
        where: { id, user_id: userId }
    });

    if (!recurringTransaction) {
        throw new Error("Recurring transaction not found");
    }

    await prisma.recurringTransaction.update({
        where: { id, user_id: userId },
        data: {
            is_active: !recurringTransaction.is_active
        }
    });

    revalidatePath("/dashboard/recurring");
}
