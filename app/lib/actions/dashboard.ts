"use server";

import { z } from "zod";
import { getUserId } from "../utils";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const BudgetSchema = z.object({
    budget: z.coerce.number()
});

export async function updateBudget(formData: FormData) {
    const userId = await getUserId();
    const { budget } = BudgetSchema.parse({
        budget: formData.get("budget")
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            monthly_budget: budget
        }
    });

    revalidatePath("/dashboard");
}
