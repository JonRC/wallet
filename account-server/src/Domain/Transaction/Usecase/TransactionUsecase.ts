import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { depositFromAtm } from "@/Domain/Transaction/Usecase/depositFromAtm";
import { getTransactionDetail } from "@/Domain/Transaction/Usecase/getTransactionDetail";

export const TransactionUsecase = (input: {
  transactionRepository: TransactionRepository;
}) => ({
  depositFromAtm: depositFromAtm(input.transactionRepository),
  getTransactionDetail: getTransactionDetail(input.transactionRepository),
});

export type TransactionUsecase = ReturnType<typeof TransactionUsecase>;
