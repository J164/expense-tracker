import { ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { lusitana } from "./fonts";
import Link from "next/link";
import { fetchRecentTransactions } from "@/app/lib/data";

export default async function RecentTransactions({
    userId
}: {
    userId: number;
}) {
    const transactions = await fetchRecentTransactions(userId);

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Latest Transactions
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    {transactions.map((transaction, i) => {
                        return (
                            <div
                                key={transaction.id}
                                className={clsx(
                                    "flex flex-row items-center justify-between py-4",
                                    {
                                        "border-t": i !== 0
                                    }
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {transaction.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {transaction.category}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    ${transaction.amount.toFixed(2)}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <Link
                    className="flex items-center pb-2 pt-6 gap-1"
                    href={"/dashboard/transactions"}
                >
                    <h3 className="ml-2 text-sm text-gray-500 ">See more</h3>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500" />
                </Link>
            </div>
        </div>
    );
}
