import z from "zod";

export const transactionItemTypes = ["MAIN", "TAX", "FEE"] as const;
export const TransactionItemType = z.enum(transactionItemTypes);
export type TransactionItemType = z.infer<typeof TransactionItemType>;

export const TransactionItem = z.object({
  id: z.string(),
  transactionId: z.string(),

  value: z.number(),
  description: z.string(),

  type: TransactionItemType,
  createdAt: z.preprocess(
    (value) => typeof value === "string" && new Date(value),
    z.date()
  ),
});

export type TransactionItem = z.infer<typeof TransactionItem>;
