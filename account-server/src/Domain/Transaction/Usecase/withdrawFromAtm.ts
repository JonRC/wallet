import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { Transaction } from "@/Entity/Transaction";
import { TransactionItem } from "@/Entity/TransactionItem";

export const withdrawInAtm =
  (
    transactionRepository: TransactionRepository,
    balanceRepository: BalanceRepository
  ) =>
  async (input: { atmId: string; userId: string; value: number }) => {
    const { atmId, userId, value } = input;

    // TODO: Verify if the ATM is valid

    const feeRatio = 0.03;
    const taxRatio = 0.05;

    const fee = feeRatio * value;
    const tax = taxRatio * value;
    const finalValue = -value - fee - tax;

    // const balance = await balanceRepository.fetchByUserId({ userId });
    // if (balance?.value && balance?.value < value)
    //   throw new Error("Insufficient funds");

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
        value: -fee,
        description: `ATM fee of ${feeRatio * 100}%`,
        type: "FEE",
      },
      {
        value: -tax,
        description: `Government tax for cash withdraw ${taxRatio * 100}%`,
        type: "TAX",
      },
      {
        value: -value,
        description: "Withdraw from ATM",
        type: "MAIN",
      },
    ] satisfies Partial<TransactionItem>[];

    const { transactionId } = await transactionRepository.insertTransaction({
      transaction,
      transactionItems,
      userId,
      minBalance: Math.abs(finalValue),
    });

    // TODO: Deposit taxes and fees in the bank account of the ATM owner

    return { transactionId };
  };
