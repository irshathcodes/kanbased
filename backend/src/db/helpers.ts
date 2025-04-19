import { timestamp, text } from "drizzle-orm/pg-core";
import { usersTable, organizationsTable } from "./schema/index.js";

export const timestampColumns = {
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
};

export const deletedAtColumn = {
  deletedAt: timestamp(),
};

export const orgColumns = {
  creatorId: text("creator_id").references(() => usersTable.id),
  organizationId: text("organization_id").references(
    () => organizationsTable.id,
    {
      onDelete: "cascade",
    },
  ),
};

export const commonColumns = {
  ...timestampColumns,
  ...deletedAtColumn,
  ...orgColumns,
};
