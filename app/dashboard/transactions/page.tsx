import Pagination from "@/app/ui/transactions/pagination";
import { lusitana } from "@/app/ui/dashboard/fonts";
import Search from "@/app/ui/search";
import Table from "@/app/ui/transactions/table";
import { CreateTransaction } from "@/app/ui/transactions/buttons";
import { Suspense } from "react";
import { TransactionsTableSkeleton } from "@/app/ui/skeletons";
import { fetchTransactionsPages } from "@/app/lib/data";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query ?? "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchTransactionsPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>
                    Transactions
                </h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search transactions..." />
                <CreateTransaction />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<TransactionsTableSkeleton />}
            >
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
