import {
    UpdateTransaction,
    DeleteTransaction
} from "@/app/ui/transactions/buttons";
import { fetchFilteredTransactions } from "@/app/lib/data";
import { formatDateToLocal } from "@/app/lib/utils";

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
                            <div
                                key={transaction.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <p className="text-l font-medium">
                                                {transaction.name}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-medium">
                                        ${transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex w-full items-center justify-between pt-2">
                                    <p className="text-gray-500">
                                        {formatDateToLocal(
                                            transaction.created_at
                                                .toISOString()
                                                .split("T")[0]
                                        )}
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <UpdateTransaction
                                            id={transaction.id}
                                        />
                                        <DeleteTransaction
                                            id={transaction.id}
                                        />
                                    </div>
                                </div>
                            </div>
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
                                <tr
                                    key={transaction.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{transaction.name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(
                                            transaction.created_at
                                                .toISOString()
                                                .split("T")[0]
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {transaction.category}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateTransaction
                                                id={transaction.id}
                                            />
                                            <DeleteTransaction
                                                id={transaction.id}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
