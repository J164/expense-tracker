import { NextRequest, NextResponse } from "next/server";
import { reconcileAllRecurringTransactions } from "@/app/lib/server/recurring";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await reconcileAllRecurringTransactions();

        return NextResponse.json({
            message: `Materialized ${result.insertedTransactions} recurring transactions`,
            count: result.insertedTransactions,
            updatedRules: result.updatedRules
        });
    } catch (error) {
        console.error("Error generating recurring transactions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
