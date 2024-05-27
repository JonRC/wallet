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
  "CASH_DEPOSIT",
  "REVERSAL",
] as const satisfies TransactionType[];

const validReceiverTypes = ["USER"] as const satisfies ReceiverType[];

const validSenderTypes = [
  "ATM",
  "BANK_ACCOUNT",
  "PIX",
  "POS",
] as const satisfies SenderType[];

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
} as const;

export const postDeposit = async (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    url: "/deposit",
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
      const transactionUsecase = TransactionUsecase({ transactionRepository });

      if (
        body.senderType === "ATM" &&
        body.type === "CASH_DEPOSIT" &&
        body.receiverType === "USER"
      ) {
        const { transactionId } = await transactionUsecase.depositFromAtm({
          atmId: body.senderReference,
          userId: body.receiverReference,
          value: body.value,
        });

        return reply.code(200).send({ transactionId });
      }
    },
  });
