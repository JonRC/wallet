import { pool } from "@/Database/pool";
import { Transaction } from "@/Entity/Transaction";
import { TransactionItem } from "@/Entity/TransactionItem";
import { randomUUID } from "crypto";
import { PoolClient } from "pg";

type InsertTransactionInput = {
  userId: string;
  minBalance?: number;
  transaction: Omit<Transaction, "id" | "createdAt" | "userId">;
  transactionItems: Omit<
    TransactionItem,
    "id" | "createdAt" | "transactionId"
  >[];
};

export const insertTransaction = async (input: InsertTransactionInput) => {
  const client = await pool().connect();
  await client.query("BEGIN");

  const result = await insertTransactionExecutor(client)(input)
    .then((result) => {
      client.query("COMMIT");
      return result;
    })
    .catch((error) => {
      client.query("ROLLBACK");
      throw error;
    })
    .finally(() => client.release());

  return result;
};

export const insertTransactionExecutor =
  (client: PoolClient) => async (input: InsertTransactionInput) => {
    const sql = await import("sql-template-tag").then(
      (module) => module.default
    );

    const { userId, transaction, transactionItems, minBalance = 0 } = input;

    const transactionId = randomUUID();

    const itemsValue = transactionItems.reduce((total, item) => {
      return total + item.value;
    }, 0);

    if (transaction.value !== itemsValue) {
      throw new Error(
        "Transaction value does not match the sum of items value"
      );
    }

    // Insert balance if it does not exist
    await client.query(sql`
      INSERT INTO balance (user_id, value)
      VALUES (${userId}, 0)
      ON CONFLICT DO NOTHING;
    `);

    // Lock balance row
    const balance = await client.query(sql`
      SELECT *
      FROM balance
      WHERE
        balance.user_id = ${userId} AND
        balance.value >= ${minBalance}
      LIMIT 1
      FOR UPDATE;
    `);
    if (balance.rows.length === 0) {
      throw new Error("Insufficient funds");
    }

    // Insert transaction
    await client.query(sql`
      INSERT INTO transaction (
        id,
        user_id,
        "value",
        "type",
        "receiver_type",
        "sender_type",
        "receiver_reference",
        "sender_reference",
        "description"
      )
      VALUES (
        ${transactionId},
        ${userId},
        ${transaction.value},
        ${transaction.type},
        ${transaction.receiverType},
        ${transaction.senderType},
        ${transaction.receiverReference},
        ${transaction.senderReference},
        ${transaction.description}
      );
    `);

    // Insert transaction items
    const itemSqls = transactionItems.map(
      (transactionItem) => sql`
      INSERT INTO transaction_item (
        transaction_id,
        value,
        description,
        type
      ) VALUES (
        ${transactionId},
        ${transactionItem.value},
        ${transactionItem.description},
        ${transactionItem.type}
      );
    `
    );

    for (const itemSql of itemSqls) {
      await client.query(itemSql);
    }

    // Update balance
    const balanceUpdateSql = sql`
      UPDATE balance
      SET
        value = value + ${transaction.value}
      WHERE
        user_id = ${userId};
    `;

    await client.query(balanceUpdateSql);

    return { transactionId };
  };
