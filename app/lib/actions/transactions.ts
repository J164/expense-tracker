"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { dollarsToCents } from "../currency";
import {
    createTransaction as createTransactionInRepo,
    deleteTransaction as deleteTransactionInRepo,
    updateTransaction as updateTransactionInRepo
} from "../server/repository";
import { requireUserId } from "../session";

const TransactionSchema = z.object({
    name: z.string().trim().min(1),
    amount: z.coerce.number(),
    date: z.string(),
    category: z.string().nullish()
});

export async function createTransaction(formData: FormData) {
    const userId = await requireUserId();
    const { name, amount, date, category } = TransactionSchema.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: formData.get("category")
    });

    await createTransactionInRepo({
        userId,
        amountCents: dollarsToCents(amount),
        category: category || null,
        purchaseDate: date,
        name
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
}

export async function updateTransaction(id: string, formData: FormData) {
    const userId = await requireUserId();
    const { name, amount, date, category } = TransactionSchema.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: formData.get("category")
    });

    await updateTransactionInRepo({
        id,
        userId,
        amountCents: dollarsToCents(amount),
        category: category || null,
        purchaseDate: date,
        name
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
    const userId = await requireUserId();
    await deleteTransactionInRepo(userId, id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
}
