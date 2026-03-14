"use server";

import { z } from "zod";
import { requireUserId } from "../session";
import { revalidatePath } from "next/cache";
import { dollarsToCents } from "../currency";
import { updateBudget as updateBudgetInRepo } from "../server/repository";

const BudgetSchema = z.object({
    budget: z.coerce.number()
});

export async function updateBudget(formData: FormData) {
    const userId = await requireUserId();
    const { budget } = BudgetSchema.parse({
        budget: formData.get("budget")
    });

    await updateBudgetInRepo(userId, dollarsToCents(budget));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
}
