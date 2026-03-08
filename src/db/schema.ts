import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashed_password: varchar("hashed_password", { length: 256 })
    .notNull()
    .default("unset"),
  is_chirpy_red: boolean("is_chirpy_red").notNull().default(false),
});
