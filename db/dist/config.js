import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const dbSrcDir = dirname(__filename);
const projectRoot = dirname(dbSrcDir);
dotenv.config({ path: join(projectRoot, ".env") });
const migrationConfig = {
    migrationsFolder: "./src/migrations",
};
export const config = {
    api: {
        platform: process.env.PLATFORM,
    },
    db: {
        url: process.env.DATABASE_URL,
        migrationConfig,
    },
    secret: process.env.SECRET,
};
// Validate required environment variables
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Please set up your database connection.");
    console.error("Create a .env file based on .env.example");
    process.exit(1);
}
