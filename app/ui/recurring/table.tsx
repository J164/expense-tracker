import {
    UpdateRecurringTransaction,
    DeleteRecurringTransaction,
    ToggleRecurringTransactionStatus
} from "./buttons";
import { formatDateToLocal, formatRecurringTransaction } from "@/app/lib/utils";
import { fetchFilteredRecurringTransactions } from "@/app/lib/data";

export default async function RecurringTransactionsTable({
    query,
    currentPage
}: {
    query: string;
    currentPage: number;
}) {
    const recurringTransactions = await fetchFilteredRecurringTransactions(
        query,
        currentPage
    );

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {recurringTransactions?.map(recurringTransaction => {
                            const formatted =
                                formatRecurringTransaction(
                                    recurringTransaction
                                );
                            return (
                                <div
                                    key={recurringTransaction.id}
                                    className="mb-2 w-full rounded-md bg-white p-4"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <p>{formatted.name}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {formatted.category ||
                                                    "No category"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ToggleRecurringTransactionStatus
                                                id={recurringTransaction.id}
                                                isActive={
                                                    recurringTransaction.is_active
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <div>
                                            <p className="text-xl font-medium">
                                                ${formatted.amount}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatted.frequency} • Started{" "}
                                                {formatDateToLocal(
                                                    formatted.start_date
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <UpdateRecurringTransaction
                                                id={recurringTransaction.id}
                                            />
                                            <DeleteRecurringTransaction
                                                id={recurringTransaction.id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                                    className="px-3 py-5 font-medium"
                                >
                                    Frequency
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Start Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Status
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
                            {recurringTransactions?.map(
                                recurringTransaction => {
                                    const formatted =
                                        formatRecurringTransaction(
                                            recurringTransaction
                                        );
                                    return (
                                        <tr
                                            key={recurringTransaction.id}
                                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                        >
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <p>{formatted.name}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                ${formatted.amount}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {formatted.category ||
                                                    "No category"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {formatted.frequency}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {formatDateToLocal(
                                                    formatted.start_date
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                <ToggleRecurringTransactionStatus
                                                    id={recurringTransaction.id}
                                                    isActive={
                                                        recurringTransaction.is_active
                                                    }
                                                />
                                            </td>
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex justify-end gap-3">
                                                    <UpdateRecurringTransaction
                                                        id={
                                                            recurringTransaction.id
                                                        }
                                                    />
                                                    <DeleteRecurringTransaction
                                                        id={
                                                            recurringTransaction.id
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
