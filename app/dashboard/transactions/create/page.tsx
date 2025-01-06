import Breadcrumbs from "@/app/ui/transactions/breadcrumbs";
import Form from "@/app/ui/transactions/create-form";

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Invoices", href: "/dashboard/invoices" },
                    {
                        label: "Create Invoice",
                        href: "/dashboard/invoices/create",
                        active: true
                    }
                ]}
            />
            <Form />
        </main>
    );
}
