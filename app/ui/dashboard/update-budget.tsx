"use client";
import { CurrencyDollarIcon, PencilIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import { updateBudget } from "@/app/lib/actions/dashboard";

export default function UpdateBudget({
    id,
    budget
}: {
    id: string;
    budget: string;
}) {
    const updateBudgetWithId = updateBudget.bind(null, id);

    return (
        <Modal
            action={updateBudgetWithId}
            title="Update Budget"
            icon={<PencilIcon className="w-5" />}
        >
            <div className="mb-4">
                <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium"
                >
                    Enter your budget for this month
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input
                            id="budget"
                            name="budget"
                            type="number"
                            step="0.01"
                            placeholder="Enter USD amount"
                            defaultValue={budget}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        Note: this will not affect your default budget for
                        future months
                    </p>
                </div>
            </div>
        </Modal>
    );
}
