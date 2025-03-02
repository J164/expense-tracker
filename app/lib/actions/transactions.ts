"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "../prisma";
import { getUserId } from "../utils";

const TransactionSchema = z.object({
    name: z.string(),
    amount: z.coerce.number(),
    date: z.string(),
    category: z.string().nullish()
});

export async function createTransaction(formData: FormData) {
    const userId = await getUserId();
    const { name, amount, date, category } = TransactionSchema.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: formData.get("category")
    });

    await prisma.transaction.create({
        data: {
            user_id: userId,
            amount,
            category,
            purchase_date: new Date(date),
            name,
            created_at: new Date()
        }
    });

    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
}

export async function updateTransaction(id: string, formData: FormData) {
    const userId = await getUserId();
    const { name, amount, date, category } = TransactionSchema.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: formData.get("category")
    });

    await prisma.transaction.update({
        where: { id, user_id: userId },
        data: {
            amount,
            category,
            purchase_date: new Date(date),
            name
        }
    });

    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
    const userId = await getUserId();
    await prisma.transaction.delete({
        where: { id, user_id: userId }
    });
    revalidatePath("/dashboard/transactions");
}
