process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    api: {
        platform: process.env.PLATFORM,
    },
    db: {
        url: process.env.DB_URL,
        migrationConfig,
    },
    secret: process.env.SECRET,
};
