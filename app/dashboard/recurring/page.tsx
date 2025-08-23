import Pagination from "@/app/ui/transactions/pagination";
import Search from "@/app/ui/search";
import RecurringTransactionsTable from "@/app/ui/recurring/table";
import { CreateRecurringTransaction } from "@/app/ui/recurring/buttons";
import { Suspense } from "react";
import { RecurringTransactionsTableSkeleton } from "@/app/ui/skeletons";
import { fetchRecurringTransactionsPages } from "@/app/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recurring Transactions"
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchRecurringTransactionsPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Recurring Transactions</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search recurring transactions..." />
                <CreateRecurringTransaction />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<RecurringTransactionsTableSkeleton />}
            >
                <RecurringTransactionsTable
                    query={query}
                    currentPage={currentPage}
                />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
