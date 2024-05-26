import "dotenv/config";
import fs from "fs/promises";
import { join, resolve } from "path";
import pg, { Client, ClientConfig } from "pg";

const migrationFileRegex = /^\d+_.*?\.ts&/;

const migrationPath = resolve(__dirname, "migration");

export const runMigrations = async () => {
  console.log("Running migrations");

  const config: ClientConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
  };

  console.log({ config });

  const client = new Client(config);

  client.connect();

  client.on("notification", (msg) => console.log(msg));
  client.on("notice", (msg) => console.log(msg));

  const migrationFilePaths = await fs.readdir(migrationPath);

  console.log({ migrationPath });

  const migrations = migrationFilePaths
    .filter((path) => migrationFileRegex.test(path))
    .map((path) => ({
      path,
      timestamp: Number(path.split("_").at(0)),
      name: path.split("_").at(1)?.split(".").at(0),
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

  for (const { name, path } of migrations) {
    const importPath = join(migrationPath, path);
    const migrationSql = (await import(importPath)).default.default;
    if (typeof migrationSql !== "string")
      throw new Error("Migration file must export a string as default");
    console.log(`running ${name}`);
    await client.query(migrationSql);
    console.log(`Migration ${name} executed`);
  }

  await client.end();
};

runMigrations();
