import { BanknotesIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./fonts";
import { fetchCardData } from "@/app/lib/data";

export function Card({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <BanknotesIcon className="h-5 w-5 text-gray-700" />
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export async function CardWrapper({ userId }: { userId: number }) {
    const { remaining_budget, budget } = await fetchCardData(userId);

    return (
        <>
            <Card title="Remaining Budget">
                <p
                    className={`${lusitana.className}
                            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
                >
                    {`$${remaining_budget}`}{" "}
                    <span className="text-gray-500">{`/ $${budget}`}</span>
                </p>
            </Card>
        </>
    );
}
