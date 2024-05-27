import z from "zod";

export const transactionTypes = [
  "TRANSFER",
  "OPEN_WALLET",
  "LOAN",
  "DEBIT",
  "REVERSAL",
  "TAXE",
  "FEE",
  "CASH",
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
  "ATM",
] as const;
export const ReceiverType = z.enum(receiverTypes);
export type ReceiverType = z.infer<typeof ReceiverType>;

export const senderTypes = [
  "USER",
  "PIX",
  "BANK_ACCOUNT",
  "POS",
  "ATM",
] as const;
export type SenderType = z.infer<typeof SenderType>;
export const SenderType = z.enum(senderTypes);

export const Transaction = z.preprocess(
  (value: any) => ({
    userId: value?.user_id,
    receiverType: value?.receiver_type,
    senderType: value?.sender_type,
    receiverReference: value?.receiver_reference,
    senderReference: value?.sender_reference,
    createdAt: value?.created_at,
    ...value,
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
    value: z.number(),

    type: TransactionType,
    receiverType: ReceiverType,
    senderType: SenderType,

    receiverReference: z.string(),
    senderReference: z.string(),
    description: z.string(),

    createdAt: z.date(),
  })
);

export type Transaction = z.infer<typeof Transaction>;
