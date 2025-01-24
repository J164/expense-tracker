"use server";

import { z } from "zod";
import { getUserId } from "../utils";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
    default_budget: z.coerce.number()
});

export async function updateProfile(formData: FormData) {
    const userId = await getUserId();
    const { default_budget } = ProfileSchema.parse({
        default_budget: formData.get("budget")
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            default_budget
        }
    });

    revalidatePath("/dashboard/profile");
}
