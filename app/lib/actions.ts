"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

    await sql`
        INSERT INTO Transactions (user_id, amount, category, purchase_date, name, created_at)
        VALUES (${userId}, ${amount}, ${category}, ${date}, ${name}, CURRENT_TIMESTAMP)`;

    revalidatePath("/dashboard/transactions");
    redirect("/dashboard/transactions");
}
