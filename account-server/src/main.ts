import "dotenv/config";
import { pool } from "@/Database/pool";
import { initServer } from "@/Server/initServer";

export const main = () => {
  pool();
  const app = initServer();
};

main();

process.on("uncaughtException", async (error) => {
  console.log(error);
  await pool().end();
  process.exit(1);
});

process.on("unhandledRejection", async (error) => {
  console.log(error);
  await pool().end();
  process.exit(1);
});
