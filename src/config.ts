import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
  platform: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};
type Config = {
  api: APIConfig;
  db: DBConfig;
  secret: string;
};

export const config: Config = {
  api: {
    platform: process.env.PLATFORM!,
  },
  db: {
    url: process.env.DB_URL!,
    migrationConfig,
  },
  secret: process.env.SECRET!,
};
