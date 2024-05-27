import fastify from "fastify";
import cors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fs from "fs/promises";
import { join } from "path";
import { balanceRouter } from "@/Domain/Balance/Controller/balanceRouter";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { transactionRouter } from "@/Domain/Transaction/Controller/transactionRouter";

const port = 3000;

export const initServer = async () => {
  const app = fastify();

  app.register(cors, {
    origin: "*",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Wallet Project - Account Server API",
        description: "API for account management. Transactions, balances, etc.",
        version: "1.0.0",
      },
      servers: [
        { url: `http://localhost:${port}`, description: "Development server" },
        { url: "https://account.wallet.com", description: "Production server" },
      ],

      components: {
        securitySchemes: {
          customer: {
            type: "http",
            scheme: "bearer",
          },
          internal: {
            type: "apiKey",
            in: "header",
            name: "key",
          },
          partner: {
            type: "apiKey",
            in: "header",
            name: "key",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  const theme = new SwaggerTheme();
  const content = theme.getBuffer(SwaggerThemeNameEnum.FLATTOP);

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    theme: {
      css: [{ filename: "theme.css", content }],
    },
  });

  app.after(() => {
    app.register(balanceRouter, { prefix: "/balance" });
    app.register(transactionRouter, { prefix: "/transaction" });
  });

  app.setErrorHandler((error, request, reply) => {
    if (error.statusCode && error.statusCode < 500) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }
    console.error(error);
    reply.status(500).send({ message: "Internal server error" });
  });

  await app.ready();

  const openApiYaml = app.swagger({ yaml: true });
  await fs.writeFile(join("docs", "openapi.yml"), openApiYaml);

  await app.listen({
    port,
    host: "0.0.0.0",
  });

  console.log(`Server running on port ${port}`);

  return app;
};
