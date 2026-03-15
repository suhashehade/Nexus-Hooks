import * as schema from "./schema.js";
import postgres from "postgres";
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export * from "./queries/actions.js";
export * from "./queries/jobs.js";
export * from "./queries/pipelineActions.js";
export * from "./queries/pipelines.js";
export * from "./queries/pipelinesSubscribers.js";
export * from "./queries/sources.js";
export * from "./queries/subscribers.js";
export * from "./queries/deliveryAttempts.js";
export * from "./schema.js";
