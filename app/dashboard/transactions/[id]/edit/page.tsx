import { fetchTransaction } from "@/app/lib/data";
import { formatTransaction } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/transactions/breadcrumbs";
import Form from "@/app/ui/transactions/edit-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const transaction = await fetchTransaction(id);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Transactions", href: "/dashboard/transactions" },
                    {
                        label: "Edit Transaction",
                        href: `/dashboard/transactions/${id}/edit`,
                        active: true
                    }
                ]}
            />
            <Form transaction={formatTransaction(transaction)} />
        </main>
    );
}
