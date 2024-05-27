import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { TransactionUsecase } from "@/Domain/Transaction/Usecase/TransactionUsecase";
import { Transaction } from "@/Entity/Transaction";

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const response = {
  200: z.object({
    transactions: z.array(Transaction),
  }),
} as const;

const headers = z.object({
  "user-id": z.string().uuid(),
});

export const getTransactions = async (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    url: "/",
    method: "GET",
    schema: {
      security: [{ customer: [] }, { internal: [] }],
      tags: ["Transaction"],
      response,
      headers,
    },
    handler: async (request, reply) => {
      const userId = request.headers["user-id"];

      const transactionRepository = TransactionRepository();
      const balanceRepository = BalanceRepository();
      const transactionUsecase = TransactionUsecase({
        transactionRepository,
        balanceRepository,
      });

      const { transactions } = await transactionUsecase.getTransactions({
        userId,
      });

      return reply.code(200).send({ transactions });
    },
  });
