import Link from "next/link";
import {
    CalendarDateRangeIcon,
    CurrencyDollarIcon,
    IdentificationIcon
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { createTransaction } from "@/app/lib/actions/transactions";
import CategorySelector from "../category-selector";

export default async function Form() {
    return (
        <form action={createTransaction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium"
                    >
                        Enter transaction name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="string"
                                placeholder="Enter transaction name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium"
                    >
                        Enter transaction amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="Enter USD amount"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium"
                    >
                        Select transaction date
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="date"
                                name="date"
                                type="date"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm outline-2 placeholder:text-gray-500"
                                defaultValue={
                                    new Date().toISOString().split("T")[0]
                                }
                                required
                            />
                            <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-medium"
                    >
                        Choose category
                    </label>
                    <CategorySelector />
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/transactions"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Transaction</Button>
            </div>
        </form>
    );
}
