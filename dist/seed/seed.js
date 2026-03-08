import { seedSources } from "./sources.seed.js";
import { seedSubscribers } from "./subscribers.seed.js";
async function seed() {
    try {
        await seedSources();
        await seedSubscribers();
        console.log("🌱 Database seeded successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed", error);
        process.exit(1);
    }
}
seed();
