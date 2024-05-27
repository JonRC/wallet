import { pool } from "@/Database/pool";
import { TransactionItem } from "@/Entity/TransactionItem";
import z from "zod";

export const fetchManyTransactionItems = async (input: {
  transactionId: string;
}): Promise<TransactionItem[]> => {
  const sql = await import("sql-template-tag").then((module) => module.default);

  const fetchManyItemsSql = sql`
    SELECT *
    FROM transaction_item
    WHERE transaction_id = ${input.transactionId};
  `;

  const result = await pool().query(fetchManyItemsSql);
  const transactionItems = await z
    .array(TransactionItem)
    .parseAsync(result.rows);

  return transactionItems;
};
