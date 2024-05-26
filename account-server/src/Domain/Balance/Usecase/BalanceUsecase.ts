import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { checkBalance } from "@/Domain/Balance/Usecase/checkBalance";

export const BalanceUsecase = (input: {
  balanceRepository: BalanceRepository;
}) => ({
  checkBalance: checkBalance(input.balanceRepository),
});

export type BalanceUsecase = ReturnType<typeof BalanceUsecase>;
