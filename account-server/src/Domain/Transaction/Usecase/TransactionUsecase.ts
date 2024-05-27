import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { depositFromAtm } from "@/Domain/Transaction/Usecase/depositFromAtm";
import { getTransactionDetail } from "@/Domain/Transaction/Usecase/getTransactionDetail";
import { getTransactions } from "@/Domain/Transaction/Usecase/getTransactions";
import { withdrawInAtm } from "@/Domain/Transaction/Usecase/withdrawFromAtm";

export const TransactionUsecase = (input: {
  transactionRepository: TransactionRepository;
  balanceRepository: BalanceRepository;
}) => ({
  depositFromAtm: depositFromAtm(input.transactionRepository),
  getTransactionDetail: getTransactionDetail(input.transactionRepository),
  withdrawFromAtm: withdrawInAtm(
    input.transactionRepository,
    input.balanceRepository
  ),
  getTransactions: getTransactions(input.transactionRepository),
});

export type TransactionUsecase = ReturnType<typeof TransactionUsecase>;
