import { getAction } from "../queries/actions.js";
import { getSource } from "../queries/sources.js";
import { getSubscriber } from "../queries/subscribers.js";
import { seedActions } from "./actions.seed.js";
import { seedSources } from "./sources.seed.js";
import { seedSubscribers } from "./subscribers.seed.js";
async function seed() {
    try {
        const existingSource = await getSource();
        const existingSubscriber = await getSubscriber();
        const existingAction = await getAction();
        if (existingSource.length === 0) {
            await seedSources();
            console.log("🌱 Sources seeded");
        }
        else {
            console.log("⏭ Sources already seeded");
        }
        if (existingSubscriber.length === 0) {
            await seedSubscribers();
            console.log("🌱 Subscribers seeded");
        }
        else {
            console.log("⏭ Subscribers already seeded");
        }
        if (existingAction.length === 0) {
            await seedActions();
            console.log("🌱 Actions seeded");
        }
        else {
            console.log("⏭ Actions already seeded");
        }
        console.log("✅ Database seed check completed");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed", error);
        process.exit(1);
    }
}
seed();
