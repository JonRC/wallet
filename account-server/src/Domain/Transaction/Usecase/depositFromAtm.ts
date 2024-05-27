import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { Transaction } from "@/Entity/Transaction";
import { TransactionItem } from "@/Entity/TransactionItem";

export const depositFromAtm =
  (transactionRepository: TransactionRepository) =>
  async (input: { atmId: string; userId: string; value: number }) => {
    const { atmId, userId, value } = input;

    // Verify if the ATM is valid

    const feeRatio = 0.05;
    const taxRatio = 0.01;

    const fee = feeRatio * value;
    const tax = taxRatio * value;
    const finalValue = value - fee - tax;

    const transaction = {
      type: "CASH_DEPOSIT",
      senderType: "ATM",
      receiverType: "USER",
      receiverReference: userId,
      senderReference: atmId,
      value: finalValue,
      description: "Deposit from ATM",
    } satisfies Partial<Transaction>;

    const transactionItems = [
      {
        value: -fee,
        description: `ATM fee of ${feeRatio * 100}%`,
        type: "FEE",
      },
      {
        value: -tax,
        description: `Government tax for cash deposit ${taxRatio * 100}%`,
        type: "TAX",
      },
      {
        value: value,
        description: "Deposit from ATM",
        type: "MAIN",
      },
    ] satisfies Partial<TransactionItem>[];

    const { transactionId } = await transactionRepository.insertTransaction({
      transaction,
      transactionItems,
      userId,
    });

    return { transactionId };
  };
