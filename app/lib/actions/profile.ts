"use server";

import { z } from "zod";
import { getUserId } from "../utils";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const ProfileSchema = z.object({
    monthly_budget: z.coerce.number()
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
