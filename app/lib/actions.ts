"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "./prisma";

const CreateTransactionSchema = z.object({
    name: z.string(),
    amount: z.coerce.number(),
    date: z.string(),
    category: z.string()
});

export async function createTransaction(userId: number, formData: FormData) {
    const { name, amount, date, category } = CreateTransactionSchema.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: formData.get("category")
    });

    await prisma.transactions.create({
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
