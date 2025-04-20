import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "../env.js";
import * as schema from "./schema/index.js";

export const db = drizzle({
  schema,
  connection: {
    url: env.DATABASE_URL,
  },
});

export type Db = typeof db;
export type DbTypeOrTransaction =
  | Parameters<Parameters<Db["transaction"]>[0]>[0]
  | Db;
