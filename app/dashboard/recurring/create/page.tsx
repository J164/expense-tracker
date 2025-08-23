import Form from "@/app/ui/recurring/create-form";
import Breadcrumbs from "@/app/ui/recurring/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Recurring Transaction"
};

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: "Recurring Transactions",
                        href: "/dashboard/recurring"
                    },
                    {
                        label: "Create Recurring Transaction",
                        href: "/dashboard/recurring/create",
                        active: true
                    }
                ]}
            />
            <Form />
        </main>
    );
}
