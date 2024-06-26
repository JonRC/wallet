import { getTransactionId } from "@/Domain/Transaction/Controller/getTransactionId";
import { getTransactions } from "@/Domain/Transaction/Controller/getTransactions";
import { postDeposit } from "@/Domain/Transaction/Controller/postDeposit";
import { postWithdraw } from "@/Domain/Transaction/Controller/postWithdraw";
import { FastifyInstance } from "fastify";

export const transactionRouter = async (app: FastifyInstance) => {
  app.register(postDeposit);
  app.register(getTransactionId);
  app.register(postWithdraw);
  app.register(getTransactions);
};
