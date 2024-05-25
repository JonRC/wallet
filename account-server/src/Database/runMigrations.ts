import fs from "fs/promises";
import { join } from "path";
import pg, { Client } from "pg";

const migrationFileRegex = /^\d+_.*?\.ts&/;

const migrationPath = join("src", "Database", "migration");

export const runMigrations = async () => {
  const client = new Client({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
  });

  client.on("notification", (msg) => console.log(msg));
  client.on("notice", (msg) => console.log(msg));

  const migrationFilePaths = await fs.readdir(migrationPath);

  const migrations = migrationFilePaths
    .filter((path) => migrationFileRegex.test(path))
    .map((path) => ({
      path,
      timestamp: Number(path.split("_").at(0)),
      name: path.split("_").at(1)?.split(".").at(0),
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

  for (const { name, path } of migrations) {
    const migrationSql = (await import(join(migrationPath, path))).default;
    if (typeof migrationSql !== "string")
      throw new Error("Migration file must export a string as default");

    await client.query(migrationSql);
    console.log(`Migration ${name} executed`);
  }
};
