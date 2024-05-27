import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { Transaction } from "@/Entity/Transaction";
import { TransactionItem } from "@/Entity/TransactionItem";

export const getTransactionDetail =
  (transactionRepository: TransactionRepository) =>
  async (input: { transactionId: string }) => {
    const { transactionId } = input;

    const transaction = await transactionRepository.fetchOneTransaction({
      transactionId,
    });
    const transactionItems =
      await transactionRepository.fetchManyTransactionItems({ transactionId });

    return {
      detailedTransaction: {
        transaction,
        transactionItems,
      },
    };
  };
