import { pool } from "@/Database/pool";
import { Transaction } from "@/Entity/Transaction";

export const fetchOneTransaction = async (input: {
  transactionId: string;
}): Promise<Transaction> => {
  const sql = await import("sql-template-tag").then((module) => module.default);
  const fetchOneSql = sql`
    SELECT *
    FROM transaction
    WHERE id = ${input.transactionId}
    LIMIT 1;
  `;

  const result = await pool().query(fetchOneSql);
  const transaction = await Transaction.parseAsync(result.rows[0]);

  return transaction;
};
