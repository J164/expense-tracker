"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "./prisma";
import { getUserId } from "./utils";

const CreateTransactionSchema = z.object({
    name: z.string(),
    amount: z.coerce.number(),
    date: z.string(),
    category: z.string()
});

export async function createTransaction(formData: FormData) {
    const userId = await getUserId();
    const { name, amount, date, category } = CreateTransactionSchema.parse({
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
