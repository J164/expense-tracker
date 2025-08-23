import Form from "@/app/ui/recurring/edit-form";
import Breadcrumbs from "@/app/ui/recurring/breadcrumbs";
import { fetchRecurringTransaction } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Recurring Transaction"
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [recurringTransaction] = await Promise.all([
        fetchRecurringTransaction(id)
    ]);

    if (!recurringTransaction) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: "Recurring Transactions",
                        href: "/dashboard/recurring"
                    },
                    {
                        label: "Edit Recurring Transaction",
                        href: `/dashboard/recurring/${id}/edit`,
                        active: true
                    }
                ]}
            />
            <Form recurringTransaction={recurringTransaction} />
        </main>
    );
}
