import { Transaction } from "./Transaction";

export const transactionItemTypes = ["MAIN", "TAX", "FEE"] as const;
export type TransactionItemType = (typeof transactionItemTypes)[number];

export type TransactionItem = {
  id: string;
  transactionId: Transaction["id"];

  value: number;
  description: string;

  type: TransactionItemType;

  createdAt: Date;
};
