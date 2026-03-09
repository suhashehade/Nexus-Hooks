import * as schema from "./schema.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
const postgres = require("postgres");

const migrationClient = postgres(config.db.url!, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig!);

export const db = drizzle(migrationClient, { schema });
