import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";

export const checkBalance =
  (balanceRepository: BalanceRepository) =>
  async (input: { userId: string }) => {
    const balance = await balanceRepository.fetchByUserId({
      userId: input.userId,
    });

    // Notify 'CheckBalanceEvent'

    return { balance: balance?.value };
  };
