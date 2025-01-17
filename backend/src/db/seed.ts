import type { Table } from "drizzle-orm";

import { getTableName, sql } from "drizzle-orm";

import { env } from "../env.js";
import { db, type Db } from "./index.js";
import * as schema from "./schema/index.js";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: Db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
  );
}

for (const table of [schema.boardsTable, schema.sessionsTable]) {
  await resetTable(db, table);
}

// await db.delete(table); // clear tables without truncating / resetting ids
await db.delete(schema.usersTable);

// TODO: Add seeds later

await db.$client.end();
