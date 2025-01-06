import { BanknotesIcon } from "@heroicons/react/24/outline";

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
