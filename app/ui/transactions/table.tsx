import { fetchFilteredTransactions } from "@/app/lib/data";
import { formatTransaction } from "@/app/lib/utils";
import TableEntry from "./table-entry";
import MobileTableEntry from "./mobile-table-entry";

export default async function TransactionsTable({
    query,
    currentPage
}: {
    query: string;
    currentPage: number;
}) {
    const transactions = await fetchFilteredTransactions(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {transactions?.map(transaction => (
                            <MobileTableEntry
                                key={transaction.id}
                                transaction={formatTransaction(transaction)}
                            />
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-5 font-medium sm:pl-6"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Amount
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3 pl-6 pr-3"
                                >
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {transactions?.map(transaction => (
                                <TableEntry
                                    key={transaction.id}
                                    transaction={formatTransaction(transaction)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
