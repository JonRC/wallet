import { pool } from "@/Database/pool";
import { Transaction } from "@/Entity/Transaction";
import z from "zod";

export const fetchManyTransactions = async (input: { userId: string }) => {
  const sql = await import("sql-template-tag").then((module) => module.default);
  const fetchManySql = sql`
    SELECT *
    FROM transaction
    WHERE user_id = ${input.userId};
  `;

  const result = await pool().query(fetchManySql);
  const transactions = await z.array(Transaction).parseAsync(result.rows);

  return { transactions };
};
