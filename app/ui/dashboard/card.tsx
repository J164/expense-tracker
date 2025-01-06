import { BanknotesIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./fonts";

export function Card({
    title,
    value
}: {
    title: string;
    value: number | string;
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <BanknotesIcon className="h-5 w-5 text-gray-700" />
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p
                className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                {`$${value}`}
            </p>
        </div>
    );
}
