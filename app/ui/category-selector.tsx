import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import { fetchAllAvailableTags } from "@/app/lib/data";

interface CategorySelectorProps {
    defaultValue?: string;
    name?: string;
    id?: string;
    required?: boolean;
}

export default async function CategorySelector({
    defaultValue = "",
    name = "category",
    id = "category",
    required = false
}: CategorySelectorProps) {
    const availableTags = await fetchAllAvailableTags();

    return (
        <div className="relative">
            <select
                id={id}
                name={name}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={defaultValue}
                required={required}
            >
                <option value="" disabled>
                    Select a category
                </option>
                {availableTags.map(tag => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
            <ArchiveBoxArrowDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
    );
}
