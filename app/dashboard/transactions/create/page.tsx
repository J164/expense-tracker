import Breadcrumbs from "@/app/ui/transactions/breadcrumbs";
import Form from "@/app/ui/transactions/create-form";

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Transactions", href: "/dashboard/transactions" },
                    {
                        label: "Create Transaction",
                        href: "/dashboard/transactions/create",
                        active: true
                    }
                ]}
            />
            <Form />
        </main>
    );
}
