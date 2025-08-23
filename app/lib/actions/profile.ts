"use server";

import { z } from "zod";
import { getUserId } from "../utils";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
    monthly_budget: z.coerce.number()
});

const TagSchema = z.object({
    name: z
        .string()
        .min(1, "Tag name is required")
        .max(50, "Tag name must be 50 characters or less")
});

export async function updateProfile(formData: FormData) {
    const userId = await getUserId();
    const { monthly_budget } = ProfileSchema.parse({
        monthly_budget: formData.get("budget")
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            monthly_budget
        }
    });

    revalidatePath("/dashboard/profile");
}

export async function createTag(formData: FormData) {
    const userId = await getUserId();
    const { name } = TagSchema.parse({
        name: formData.get("tagName")
    });

    // Check if tag already exists for this user
    const existingTag = await prisma.userTag.findFirst({
        where: {
            user_id: userId,
            name: name.toLowerCase()
        }
    });

    if (existingTag) {
        throw new Error("Tag already exists");
    }

    await prisma.userTag.create({
        data: {
            name: name.toLowerCase(),
            user_id: userId
        }
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/recurring");
}

export async function deleteTag(tagId: string) {
    const userId = await getUserId();

    // Verify the tag belongs to the current user
    const tag = await prisma.userTag.findFirst({
        where: {
            id: tagId,
            user_id: userId
        }
    });

    if (!tag) {
        throw new Error("Tag not found");
    }

    await prisma.userTag.delete({
        where: { id: tagId }
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/recurring");
}
