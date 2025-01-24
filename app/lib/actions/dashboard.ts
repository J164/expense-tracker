"use server";

import { z } from "zod";
import { getUserId } from "../utils";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const BudgetSchema = z.object({
    budget: z.coerce.number()
});

export async function updateBudget(id: string, formData: FormData) {
    const userId = await getUserId();
    const { budget } = BudgetSchema.parse({
        budget: formData.get("budget")
    });

    await prisma.monthlySummary.update({
        where: { id, user_id: userId },
        data: {
            budget
        }
    });

    revalidatePath("/dashboard");
}
