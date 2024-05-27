import z from "zod";

export const transactionItemTypes = ["MAIN", "TAX", "FEE"] as const;
export const TransactionItemType = z.enum(transactionItemTypes);
export type TransactionItemType = z.infer<typeof TransactionItemType>;

export const TransactionItem = z.preprocess(
  (value: any) => ({
    transactionId: value?.transaction_id,
    createdAt: value?.created_at,
    ...value,
  }),
  z.object({
    id: z.string(),
    transactionId: z.string(),

    value: z.number(),
    description: z.string(),

    type: TransactionItemType,
    createdAt: z.date(),
  })
);

export type TransactionItem = z.infer<typeof TransactionItem>;
