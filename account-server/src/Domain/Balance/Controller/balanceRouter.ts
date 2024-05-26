import { getBalance } from "@/Domain/Balance/Controller/getBalance";
import { FastifyInstance } from "fastify";

export const balanceRouter = async (app: FastifyInstance) => {
  app.register(getBalance);
};
