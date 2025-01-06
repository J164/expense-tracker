import { fetchDashboardData } from "../lib/data";
import { Card } from "../ui/dashboard/card";
import { lusitana } from "../ui/dashboard/fonts";
import RecentTransactions from "../ui/dashboard/recent-transactions";

export default async function Page() {
    const { budget, remaining_budget, recent_transactions } =
        await fetchDashboardData(1);

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                <Card title="Remaining Budget">
                    <p
                        className={`${lusitana.className}
                            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
                    >
                        {`$${remaining_budget}`}{" "}
                        <span className="text-gray-500">{`/ $${budget}`}</span>
                    </p>
                </Card>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RecentTransactions transactions={recent_transactions} />
            </div>
        </main>
    );
}
