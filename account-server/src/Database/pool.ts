import { checkIsDockerContainer } from "@/Util/isDockerContainer";
import { Pool } from "pg";

let poolSingleton: Pool | null = null;

export const pool = () => {
  if (poolSingleton) return poolSingleton;

  const isDockerContainer = checkIsDockerContainer();
  const host = isDockerContainer ? "account-postgres" : "localhost";

  const newPool = new Pool({
    host,
    user: "wallet",
    password: "wallet",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  poolSingleton = newPool;

  return newPool;
};
