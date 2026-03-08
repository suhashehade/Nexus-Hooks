import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  secret: varchar("secret").notNull(),
});

export const actions = pgTable("actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id)
    .notNull(),
  type: varchar("type").notNull(),
  config: jsonb("config").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url").notNull(),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  address: varchar("address").notNull(),
  url: varchar("url").notNull(),
});

export const pipelines_subscribers = pgTable("pipelines_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => subscribers.id, { onDelete: "cascade" }),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  payload: jsonb("payload"),
  status: varchar("status").notNull().default("pending"), // pending / processing / completed / failed
  priority: integer("priority").default(0),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const delivery_attempts = pgTable("delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => subscribers.id, { onDelete: "cascade" }),
  status: varchar("status").notNull(), // success / failed
  attempt: integer("attempt").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Source = typeof sources.$inferInsert;
export type SubScriber = typeof subscribers.$inferInsert;
export type Pipeline = typeof pipelines.$inferInsert;
export type Job = typeof jobs.$inferInsert;
export type PipelinesSubscriber = typeof pipelines_subscribers.$inferInsert;
export type DeliveryAttempt = typeof delivery_attempts.$inferInsert;
