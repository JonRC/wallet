import { pool } from "@/Database/pool";
import { Balance } from "@/Entity/Balance";

export const fetchByUserId = async (input: {
  userId: string;
}): Promise<Balance | null> => {
  const { userId } = input;

  const result = await pool().query(
    `
    SELECT * FROM balance
    WHERE user_id = $1
    LIMIT 1;
  `,
    [userId]
  );
  if (result.rows.length === 0) return null;
  const balance = await Balance.parseAsync(result.rows[0]);

  return balance;
};
