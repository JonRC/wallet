import { fetchManyTransactionItems } from "@/Domain/Transaction/Repository/fetchManyTransactionItems";
import { fetchManyTransactions } from "@/Domain/Transaction/Repository/fetchManyTransactions";
import { fetchOneTransaction } from "@/Domain/Transaction/Repository/fetchOneTransaction";
import { insertTransaction } from "@/Domain/Transaction/Repository/insertTransaction";

export const TransactionRepository = () => ({
  insertTransaction,
  fetchOneTransaction,
  fetchManyTransactionItems,
  fetchManyTransactions,
});

export type TransactionRepository = ReturnType<typeof TransactionRepository>;
