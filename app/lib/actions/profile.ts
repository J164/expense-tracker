"use server";

import { z } from "zod";
import { dollarsToCents } from "../currency";
import {
    createTag as createTagInRepo,
    deleteTag as deleteTagInRepo,
    updateBudget
} from "../server/repository";
import { requireUserId } from "../session";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
    monthly_budget: z.coerce.number()
});

const TagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Tag name is required")
        .max(50, "Tag name must be 50 characters or less")
});

export async function updateProfile(formData: FormData) {
    const userId = await requireUserId();
    const { monthly_budget } = ProfileSchema.parse({
        monthly_budget: formData.get("budget")
    });

    await updateBudget(userId, dollarsToCents(monthly_budget));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
}

export async function createTag(formData: FormData) {
    const userId = await requireUserId();
    const { name } = TagSchema.parse({
        name: formData.get("tagName")
    });

    await createTagInRepo(userId, name);

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/recurring");
}

export async function deleteTag(tagId: string) {
    const userId = await requireUserId();
    await deleteTagInRepo(userId, tagId);
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/recurring");
}
