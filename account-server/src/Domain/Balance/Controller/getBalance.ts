import { BalanceRepository } from "@/Domain/Balance/Repository/BalanceRepository";
import { BalanceUsecase } from "@/Domain/Balance/Usecase/BalanceUsecase";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const response = {
  200: z.object({
    balance: z.number(),
  }),
  404: z.object({
    message: z.string(),
  }),
};

const headers = z.object({
  "user-id": z.string().uuid(),
});

export const getBalance = (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().route({
    schema: {
      response,
      headers,
      security: [{ apikey: [] }],
      tags: ["Balance"],
    },

    method: "GET",
    url: "/",

    handler: async (request, reply) => {
      const userId = request.headers["user-id"];
      const balanceRepository = BalanceRepository();
      const balanceUsecase = BalanceUsecase({ balanceRepository });

      const { balance } = await balanceUsecase.checkBalance({ userId });

      if (!balance)
        return reply.code(404).send({ message: "Balance not found" });

      reply.code(200).send({ balance });
    },
  });
