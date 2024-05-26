import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fs from "fs/promises";
import { join } from "path";

export const initServer = async () => {
  const app = fastify();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Wallet Project - Account Server API",
        description: "API for account management. Transactions, balances, etc.",
        version: "1.0.0",
      },
    },
  });

  app.register(fastifySwaggerUi, {
    // routePrefix: "/docs",
  });

  app.after(() => {
    // app.register(router)
  });

  await app.ready();

  const openApiYaml = app.swagger({ yaml: true });
  await fs.writeFile(join("src", "docs", "openapi.yml"), openApiYaml);

  await app.listen({
    port: 3000,
  });

  return app;
};
