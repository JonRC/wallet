import "dotenv/config";
import fs from "fs/promises";
import { join, resolve } from "path";
import pg, { Client, ClientConfig } from "pg";
import z from "zod";

const migrationFileRegex = /^\d+_.*\.(ts|js)$/;

const migrationPath = resolve(__dirname, "migration");

const ExecutedMigrations = z.array(
  z.object({
    name: z.string(),
    timestamp: z.number(),
  })
);

type ExecutedMigration = z.infer<typeof ExecutedMigrations>[number];

export const runMigrations = async () => {
  const config: ClientConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
  };

  const client = new Client(config);

  await client.connect();

  await client.query(
    "CREATE TABLE IF NOT EXISTS internal_migration (name TEXT, timestamp INT)"
  );
  const executedMigration = await getExecutedMigrations(client);

  const migrationFilePaths = await fs.readdir(migrationPath);

  const migrations = migrationFilePaths
    .filter((path) => migrationFileRegex.test(path))
    .map((path) => ({
      path,
      timestamp: Number(path.split("_")[0]),
      name: path.split("_")[1].split(".")[0],
    }))
    .filter((migration) => !executedMigration[migration.timestamp])
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

  if (migrations.length === 0) {
    console.error("No migrations to run");
    process.exit(0);
  }

  for (const { name, path, timestamp } of migrations) {
    const importPath = join(migrationPath, path);
    const migrationSql = (await import(importPath)).default.default;

    if (typeof migrationSql !== "string")
      throw new Error("Migration file must export a string as default");

    await client.query(migrationSql).catch((error) => {
      console.error(`Failed running migration ${name}: ${error.message}`);
      console.log("migration sql:", migrationSql);
      process.exit(1);
    });
    await insertExecutedMigration(client, { name, timestamp });
    console.log(`Migration ${name} executed`);
  }

  await client.end();
};

const getExecutedMigrations = async (client: Client) => {
  const executedMigrationsResult = await client.query(
    "SELECT * FROM internal_migration"
  );
  const executedMigrations = ExecutedMigrations.parse(
    executedMigrationsResult.rows
  );

  return executedMigrations.reduce((obj, migration) => {
    obj[migration.timestamp] = true;
    return obj;
  }, {} as Record<string, true>);
};

const insertExecutedMigration = async (
  client: Client,
  executedMigration: ExecutedMigration
) => {
  const { name, timestamp } = executedMigration;
  await client.query(
    "INSERT INTO internal_migration (name, timestamp) VALUES ($1, $2)",
    [name, timestamp]
  );
};

runMigrations();
