import { Decimal } from "@prisma/client/runtime/library";

export type FormatTransaction = {
    id: string;
    name: string;
    amount: string;
    purchase_date: string;
    created_at: string;
    category: string | null;
};

export type ProfileData = {
    default_budget: Decimal;
};

export type FormatProfile = {
    default_budget: string;
};
