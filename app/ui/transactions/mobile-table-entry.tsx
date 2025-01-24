import {
    UpdateTransaction,
    DeleteTransaction
} from "@/app/ui/transactions/buttons";
import { FormatTransaction } from "@/app/lib/types";
import { formatDateToLocal } from "@/app/lib/utils";

export default async function MobileTableEntry({
    transaction
}: {
    transaction: FormatTransaction;
}) {
    return (
        <div
            key={transaction.id}
            className="mb-2 w-full rounded-md bg-white p-4"
        >
            <div className="flex items-center justify-between border-b pb-2">
                <div>
                    <div className="mb-2 flex items-center">
                        <p className="text-l font-medium">{transaction.name}</p>
                    </div>
                </div>
                <p className="text-xl font-medium">${transaction.amount}</p>
            </div>
            <div className="flex w-full items-center justify-between pt-2">
                <p className="text-gray-500">
                    {formatDateToLocal(transaction.created_at)}
                </p>
                <div className="flex justify-end gap-2">
                    <UpdateTransaction id={transaction.id} />
                    <DeleteTransaction id={transaction.id} />
                </div>
            </div>
        </div>
    );
}
