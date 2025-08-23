import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        // Optional: Add authentication check here
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const now = new Date();
        const currentDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // Get all active recurring transactions
        const recurringTransactions =
            await prisma.recurringTransaction.findMany({
                where: {
                    is_active: true,
                    start_date: { lte: currentDate },
                    OR: [{ end_date: null }, { end_date: { gte: currentDate } }]
                }
            });

        const transactionsToCreate = [];
        const updatedRecurringTransactions = [];

        for (const recurring of recurringTransactions) {
            const nextGenerationDate = recurring.last_generated
                ? new Date(recurring.last_generated)
                : new Date(recurring.start_date);

            // Calculate the next generation date based on frequency
            if (recurring.frequency === "MONTHLY") {
                nextGenerationDate.setMonth(nextGenerationDate.getMonth() + 1);
            } else if (recurring.frequency === "YEARLY") {
                nextGenerationDate.setFullYear(
                    nextGenerationDate.getFullYear() + 1
                );
            }

            // If it's time to generate a new transaction
            if (nextGenerationDate <= currentDate) {
                let amount = recurring.amount;

                // For yearly transactions, divide by 12 for monthly impact
                if (recurring.frequency === "YEARLY") {
                    amount = recurring.amount.div(12);
                }

                transactionsToCreate.push({
                    user_id: recurring.user_id,
                    name: recurring.name,
                    amount,
                    category: recurring.category,
                    purchase_date: currentDate,
                    recurring_transaction_id: recurring.id,
                    created_at: new Date()
                });

                updatedRecurringTransactions.push({
                    id: recurring.id,
                    last_generated: currentDate
                });
            }
        }

        // Create all transactions at once
        if (transactionsToCreate.length > 0) {
            await prisma.transaction.createMany({
                data: transactionsToCreate
            });

            // Update the last_generated dates
            for (const update of updatedRecurringTransactions) {
                await prisma.recurringTransaction.update({
                    where: { id: update.id },
                    data: { last_generated: update.last_generated }
                });
            }
        }

        return NextResponse.json({
            message: `Generated ${transactionsToCreate.length} transactions`,
            count: transactionsToCreate.length
        });
    } catch (error) {
        console.error("Error generating recurring transactions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
