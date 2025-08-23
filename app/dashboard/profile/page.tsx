import { lusitana } from "@/app/ui/dashboard/fonts";
import { Suspense } from "react";
import { TransactionsTableSkeleton } from "@/app/ui/skeletons";
import { fetchProfile, fetchUserTags } from "@/app/lib/data";
import Profile from "@/app/ui/profile/profile";
import TagManager from "@/app/ui/profile/tag-manager";
import { formatProfile } from "@/app/lib/utils";

export default async function Page() {
    const profile = await fetchProfile();
    const userTags = await fetchUserTags();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
            </div>
            <div className="mt-4 space-y-6">
                <Suspense fallback={<TransactionsTableSkeleton />}>
                    <Profile profile={formatProfile(profile)} />
                </Suspense>
                <Suspense fallback={<TransactionsTableSkeleton />}>
                    <TagManager userTags={userTags} />
                </Suspense>
            </div>
        </div>
    );
}
