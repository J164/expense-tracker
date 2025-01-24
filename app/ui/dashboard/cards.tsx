import { BanknotesIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./fonts";
import { fetchCardData } from "@/app/lib/data";
import UpdateBudget from "./update-budget";

export function Card({
    title,
    budgetId,
    budget,
    children
}: {
    title: string;
    budgetId: string | null;
    budget: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <BanknotesIcon className="h-5 w-5 text-gray-700" />
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
                <div className="ml-auto">
                    {budgetId && <UpdateBudget id={budgetId} budget={budget} />}
                </div>
            </div>
            {children}
        </div>
    );
}

export default async function CardWrapper() {
    const { id, total_spent, budget } = await fetchCardData();

    return (
        <>
            <Card
                title="Remaining Budget"
                budgetId={id}
                budget={budget.toFixed(2)}
            >
                <p
                    className={`${lusitana.className}
                            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
                >
                    {`$${budget.minus(total_spent).toFixed(2)}`}{" "}
                    <span className="text-gray-500">{`/ $${budget.toFixed(2)}`}</span>
                </p>
            </Card>
        </>
    );
}
