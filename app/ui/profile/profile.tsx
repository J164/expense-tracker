"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import { FormatProfile } from "@/app/lib/types";
import { updateProfile } from "@/app/lib/actions/profile";

export default function Profile({ profile }: { profile: FormatProfile }) {
    return (
        <form action={updateProfile}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium"
                    >
                        Enter your default monthly budget
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="budget"
                                name="budget"
                                type="number"
                                step="0.01"
                                placeholder="Enter USD amount"
                                defaultValue={profile.default_budget}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Note: this will not affect the current month&apos;s
                            budget
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-start gap-4">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}
