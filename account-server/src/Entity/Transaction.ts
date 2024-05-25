export const transactionTypes = [
  "TRANSFER",
  "OPEN_WALLET",
  "LOAN",
  "DEBIT",
  "REVERSAL",
  "TAXE",
  "FEE",
] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const receiverTypes = [
  "USER",
  "PIX",
  "BANK_ACCOUNT",
  "BANK_SLIP",
  "CREDIT_CARD",
  "POS",
] as const;
export type ReceiverType = (typeof receiverTypes)[number];

export const senderTypes = ["USER", "PIX", "BANK_ACCOUNT", "POS"] as const;
export type SenderType = (typeof senderTypes)[number];

export type Transaction = {
  id: string;
  userId: string;

  type: TransactionType;
  receiverType: ReceiverType;
  senderType: SenderType;

  receiverReference: string;
  senderReference: string;
  description: string;

  createdAt: Date;
};
