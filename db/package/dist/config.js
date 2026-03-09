process.loadEnvFile();
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
