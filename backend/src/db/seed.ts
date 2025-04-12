import { seed } from "drizzle-seed";
import { db } from "./index.js";
import * as schema from "./schema/index.js";

async function executeSeed() {
  console.log("Seeding database...");
  await seed(db, schema);
  console.log("Database seeded successfully");
  process.exit(0);
}

executeSeed();

