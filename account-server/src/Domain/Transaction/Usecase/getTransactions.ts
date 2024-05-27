import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";

export const getTransactions =
  (transactionRepository: TransactionRepository) =>
  async (input: { userId: string }) => {
    const { userId } = input;
    const { transactions } = await transactionRepository.fetchManyTransactions({
      userId,
    });

    return { transactions };
  };
