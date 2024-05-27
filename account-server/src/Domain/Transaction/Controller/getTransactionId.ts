import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { TransactionUsecase } from "@/Domain/Transaction/Usecase/TransactionUsecase";
import { Transaction } from "@/Entity/Transaction";

import { TransactionItem } from "@/Entity/TransactionItem";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const response = {
  200: z.object({
    detailedTransaction: z.object({
      transaction: Transaction,
      transactionItems: z.array(TransactionItem),
    }),
  }),
} as const;

export const getTransactionId = async (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    url: "/:id",
    method: "GET",
    schema: {
      security: [{ customer: [] }, { internal: [] }],
      tags: ["Transaction"],
      response,
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    handler: async (request, reply) => {
      const transactionId = request.params.id;

      const transactionRepository = TransactionRepository();
      const transactionUsecase = TransactionUsecase({ transactionRepository });

      const { detailedTransaction } =
        await transactionUsecase.getTransactionDetail({
          transactionId,
        });

      return reply.code(200).send({ detailedTransaction });
    },
  });
