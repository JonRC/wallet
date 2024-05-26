import z from "zod";

export const transactionTypes = [
  "TRANSFER",
  "OPEN_WALLET",
  "LOAN",
  "DEBIT",
  "REVERSAL",
  "TAXE",
  "FEE",
] as const;
export const TransactionType = z.enum(transactionTypes);
export type TransactionType = z.infer<typeof TransactionType>;

export const receiverTypes = [
  "USER",
  "PIX",
  "BANK_ACCOUNT",
  "BANK_SLIP",
  "CREDIT_CARD",
  "POS",
] as const;
export const ReceiverType = z.enum(receiverTypes);
export type ReceiverType = z.infer<typeof ReceiverType>;

export const senderTypes = ["USER", "PIX", "BANK_ACCOUNT", "POS"] as const;
export type SenderType = z.infer<typeof SenderType>;
export const SenderType = z.enum(senderTypes);

export const Transaction = z.object({
  id: z.string(),
  userId: z.string(),

  type: TransactionType,
  receiverType: ReceiverType,
  senderType: SenderType,

  receiverReference: z.string(),
  senderReference: z.string(),
  description: z.string(),

  createdAt: z.preprocess(
    (value) => typeof value === "string" && new Date(value),
    z.date()
  ),
});

export type Transaction = z.infer<typeof Transaction>;
