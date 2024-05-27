import { getTransactionId } from "@/Domain/Transaction/Controller/getTransactionId";
import { postDeposit } from "@/Domain/Transaction/Controller/postDeposit";
import { FastifyInstance } from "fastify";

export const transactionRouter = async (app: FastifyInstance) => {
  app.register(postDeposit);
  app.register(getTransactionId);
};
