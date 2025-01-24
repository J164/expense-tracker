import {
    UpdateTransaction,
    DeleteTransaction
} from "@/app/ui/transactions/buttons";
import { FormatTransaction } from "@/app/lib/types";
import { formatDateToLocal } from "@/app/lib/utils";

export default async function TableEntry({
    transaction
}: {
    transaction: FormatTransaction;
}) {
    return (
        <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <p>{transaction.name}</p>
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                {formatDateToLocal(transaction.purchase_date)}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                ${transaction.amount}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                {transaction.category}
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <UpdateTransaction id={transaction.id} />
                    <DeleteTransaction id={transaction.id} />
                </div>
            </td>
        </tr>
    );
}
