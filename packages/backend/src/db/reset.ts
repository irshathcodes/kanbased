import { db } from "./index.js";
import * as schema from "./schema/index.js";
import { reset } from "drizzle-seed";

async function executeResetDb() {
  console.log("Resetting database...");
  await reset(db, schema);
  console.log("Database reset successfully");
  process.exit(0);
}

executeResetDb();


