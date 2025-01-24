import { lusitana } from "@/app/ui/dashboard/fonts";
import { Suspense } from "react";
import { TransactionsTableSkeleton } from "@/app/ui/skeletons";
import { fetchProfile } from "@/app/lib/data";
import Profile from "@/app/ui/profile/profile";
import { formatProfile } from "@/app/lib/utils";

export default async function Page() {
    const profile = await fetchProfile();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
            </div>
            <Suspense fallback={<TransactionsTableSkeleton />}>
                <Profile profile={formatProfile(profile)} />
            </Suspense>
        </div>
    );
}
