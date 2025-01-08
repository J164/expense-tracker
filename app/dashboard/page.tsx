import { Suspense } from "react";
import CardWrapper from "../ui/dashboard/cards";
import { lusitana } from "../ui/dashboard/fonts";
import RecentTransactions from "../ui/dashboard/recent-transactions";
import { CardsSkeleton, RecentTransactionsSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Hello, {session?.user?.name || "Welcome!"}
            </h1>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RecentTransactionsSkeleton />}>
                    <RecentTransactions />
                </Suspense>
            </div>
        </main>
    );
}
