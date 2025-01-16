import { Transaction } from "@prisma/client";

export type PlainTransaction = Omit<Transaction, "amount"> & {
    amount: number;
};
