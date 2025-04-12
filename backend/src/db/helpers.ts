import { timestamp } from "drizzle-orm/pg-core";


export const commonColumns = {
  createdAt: timestamp({ mode: "string" }).notNull(),
  updatedAt: timestamp({ mode: "string" }).notNull(),
}