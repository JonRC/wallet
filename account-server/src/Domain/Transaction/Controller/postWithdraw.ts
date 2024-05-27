import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { TransactionRepository } from "@/Domain/Transaction/Repository/TransactionRepository";
import { TransactionUsecase } from "@/Domain/Transaction/Usecase/TransactionUsecase";
import {
  ReceiverType,
  SenderType,
  TransactionType,
} from "@/Entity/Transaction";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const validTransactionTypes = [
  "CASH",
  "REVERSAL",
] as const satisfies TransactionType[];

const validReceiverTypes = [
  "ATM",
  "PIX",
  "POS",
] as const satisfies SenderType[];
const validSenderTypes = ["USER"] as const satisfies ReceiverType[];

const body = z.object({
  value: z.number().positive(),
  type: z.enum(validTransactionTypes),
  receiverType: z.enum(validReceiverTypes),
  receiverReference: z.string(),
  senderType: z.enum(validSenderTypes),
  senderReference: z.string(),
});

const response = {
  200: z.object({
    transactionId: z.string(),
  }),
  501: z.object({
    message: z.string(),
  }),
} as const;

export const postWithdraw = async (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    url: "/withdraw",
    method: "POST",
    schema: {
      body,
      security: [{ customer: [] }, { internal: [] }],
      tags: ["Transaction"],
      response,
    },
    handler: async (request, reply) => {
      const { body } = request;

      const transactionRepository = TransactionRepository();
      const balanceRepository = BalanceRepository();
      const transactionUsecase = TransactionUsecase({
        transactionRepository,
        balanceRepository,
      });

      if (
        body.receiverType === "ATM" &&
        body.type === "CASH" &&
        body.senderType === "USER"
      ) {
        const { transactionId } = await transactionUsecase.withdrawFromAtm({
          atmId: body.receiverReference,
          userId: body.senderReference,
          value: body.value,
        });

        return reply.code(200).send({ transactionId });
      }

      return reply.code(501).send({
        message: `Operation not implemented for type ${body.senderType} from ${body.senderType} to ${body.receiverType}`,
      });
    },
  });
