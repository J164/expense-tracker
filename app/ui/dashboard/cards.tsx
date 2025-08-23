import { BanknotesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./fonts";
import { fetchCardData } from "@/app/lib/data";
import UpdateBudget from "./update-budget";
import Link from "next/link";

export function Card({
    title,
    showBudgetUpdate,
    budget,
    icon: Icon = BanknotesIcon,
    children
}: {
    title: string;
    showBudgetUpdate: boolean;
    budget: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <Icon className="h-5 w-5 text-gray-700" />
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
                <div className="ml-auto">
                    {showBudgetUpdate && <UpdateBudget budget={budget} />}
                </div>
            </div>
            {children}
        </div>
    );
}

export default async function CardWrapper() {
    const { total_spent, budget, regular_transactions, recurring_impact } =
        await fetchCardData();

    return (
        <>
            <Card
                title="Remaining Budget"
                showBudgetUpdate={true}
                budget={budget.toFixed(2)}
            >
                <div className="rounded-xl bg-white px-4 py-8">
                    <p
                        className={`${lusitana.className} truncate text-center text-2xl`}
                    >
                        {`$${budget.minus(total_spent).toFixed(2)}`}{" "}
                        <span className="text-gray-500">{`/ $${budget.toFixed(2)}`}</span>
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Regular Transactions:</span>
                            <span>${regular_transactions.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Recurring (Monthly Impact):</span>
                            <span>${recurring_impact.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-medium">
                            <span>Total Spent:</span>
                            <span>${total_spent.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card
                title="Recurring Transactions"
                showBudgetUpdate={false}
                budget=""
                icon={ArrowPathIcon}
            >
                <div className="rounded-xl bg-white px-4 py-8">
                    <p
                        className={`${lusitana.className} truncate text-center text-2xl`}
                    >
                        ${recurring_impact.toFixed(2)}
                        <span className="text-sm text-gray-500 block mt-1">
                            monthly impact
                        </span>
                    </p>
                    <div className="mt-4 text-center">
                        <Link
                            href="/dashboard/recurring"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Manage Recurring →
                        </Link>
                    </div>
                </div>
            </Card>
        </>
    );
}
