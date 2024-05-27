import { fetchManyTransactionItems } from "@/Domain/Transaction/Repository/fetchManyTransactionItems";
import { fetchOneTransaction } from "@/Domain/Transaction/Repository/fetchOneTransaction";
import { insertTransaction } from "@/Domain/Transaction/Repository/insertTransaction";

export const TransactionRepository = () => ({
  insertTransaction,
  fetchOneTransaction,
  fetchManyTransactionItems,
});

export type TransactionRepository = ReturnType<typeof TransactionRepository>;
