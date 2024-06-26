import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { Transaction } from "@/Entity/Transaction";
import { TransactionItem } from "@/Entity/TransactionItem";

export const depositFromAtm =
  (transactionRepository: TransactionRepository) =>
  async (input: { atmId: string; userId: string; value: number }) => {
    const { atmId, userId, value } = input;

    // Verify if the ATM is valid

    const taxRatio = 0.01;

    const tax = taxRatio * value;
    const finalValue = value - tax;

    const transaction = {
      type: "CASH",
      senderType: "ATM",
      receiverType: "USER",
      receiverReference: userId,
      senderReference: atmId,
      value: finalValue,
      description: "Deposit from ATM",
    } satisfies Partial<Transaction>;

    const transactionItems = [
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
