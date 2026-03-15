import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:postgres@postgres:5432/nexusdb?sslmode=disable",
  },
});
