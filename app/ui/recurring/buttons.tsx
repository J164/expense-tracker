import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
    deleteRecurringTransaction,
    toggleRecurringTransactionStatus
} from "@/app/lib/actions/recurring-transactions";

export function CreateRecurringTransaction() {
    return (
        <Link
            href="/dashboard/recurring/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">
                Create Recurring Transaction
            </span>{" "}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateRecurringTransaction({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/recurring/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteRecurringTransaction({ id }: { id: string }) {
    const deleteRecurringTransactionWithId = deleteRecurringTransaction.bind(
        null,
        id
    );

    return (
        <form action={deleteRecurringTransactionWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}

export function ToggleRecurringTransactionStatus({
    id,
    isActive
}: {
    id: string;
    isActive: boolean;
}) {
    const toggleStatusWithId = toggleRecurringTransactionStatus.bind(null, id);

    return (
        <form action={toggleStatusWithId}>
            <button
                className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </button>
        </form>
    );
}
