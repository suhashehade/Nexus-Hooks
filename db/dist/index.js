import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import postgres from "postgres";
// Create database client without running migrations
// Migrations should be run separately
const migrationClient = postgres(config.db.url, { max: 1 });
export const db = drizzle(migrationClient, { schema });
// Export all queries
export * from "./queries/actions.js";
export * from "./queries/jobs.js";
export * from "./queries/pipelineActions.js";
export * from "./queries/pipelines.js";
export * from "./queries/pipelinesSubscribers.js";
export * from "./queries/sources.js";
export * from "./queries/subscribers.js";
