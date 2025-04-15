import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {
  organization as organizationsTable,
  user as usersTable,
  session as sessionsTable,
  account as accountsTable,
  verification as verificationsTable,
  member as membersTable,
  invitation as invitationsTable,
  jwks as jwksTable,
} from "./auth-schema.js";
import { commonColumns } from "../helpers.js";
import { relations } from "drizzle-orm";

export {
  organizationsTable,
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
  membersTable,
  invitationsTable,
  jwksTable,
};

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    invitations: many(invitationsTable),
    members: many(membersTable),
    boards: many(boardsTable),
    columns: many(columnsTable),
    tasks: many(tasksTable),
    notes: many(notesTable),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  members: many(membersTable),
  invitations: many(invitationsTable),
  accounts: many(accountsTable),
  boards: many(boardsTable),
  columns: many(columnsTable),
  tasks: many(tasksTable),
  notes: many(notesTable),
}));

export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const memberRelations = relations(membersTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [membersTable.organizationId],
    references: [organizationsTable.id],
  }),
  user: one(usersTable, {
    fields: [membersTable.userId],
    references: [usersTable.id],
  }),
}));

export const invitationRelations = relations(invitationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [invitationsTable.organizationId],
    references: [organizationsTable.id],
  }),
  inviter: one(usersTable, {
    fields: [invitationsTable.inviterId],
    references: [usersTable.id],
  }),
}));

export const boardsTable = pgTable("boards", {
  id: t.varchar({ length: 26 }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  color: t.varchar({ length: 255 }),
  boardUrl: t.text().notNull(),
  ...commonColumns,
});

export const boardsRelations = relations(boardsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [boardsTable.organizationId],
    references: [organizationsTable.id],
  }),
  creator: one(usersTable, {
    fields: [boardsTable.creatorId],
    references: [usersTable.id],
  }),
  columns: many(columnsTable),
}));

export const columnsTable = pgTable(
  "columns",
  {
    id: t.varchar({ length: 26 }).primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
    boardId: t
      .varchar({ length: 26 })
      .references(() => boardsTable.id, { onDelete: "cascade" })
      .notNull(),
    position: t.integer().notNull(),
    ...commonColumns,
  },
  (table) => [t.index("column_board_idx").on(table.boardId)],
);

export const columnsRelations = relations(columnsTable, ({ one, many }) => ({
  board: one(boardsTable, {
    fields: [columnsTable.boardId],
    references: [boardsTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [columnsTable.organizationId],
    references: [organizationsTable.id],
  }),
  creator: one(usersTable, {
    fields: [columnsTable.creatorId],
    references: [usersTable.id],
  }),
  tasks: many(tasksTable),
}));

export const tasksTable = pgTable(
  "tasks",
  {
    id: t.varchar({ length: 26 }).primaryKey(),
    name: t.text().notNull(),
    content: t.text(),
    columnId: t
      .varchar({ length: 26 })
      .references(() => columnsTable.id, { onDelete: "cascade" })
      .notNull(),
    position: t.doublePrecision().notNull(),
    ...commonColumns,
  },
  (table) => [t.index("column_id_idx").on(table.columnId)],
);

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  column: one(columnsTable, {
    fields: [tasksTable.columnId],
    references: [columnsTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [tasksTable.organizationId],
    references: [organizationsTable.id],
  }),
  creator: one(usersTable, {
    fields: [tasksTable.creatorId],
    references: [usersTable.id],
  }),
}));

export const notesTable = pgTable("notes", {
  id: t.varchar({ length: 26 }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  ...commonColumns,
});

export const notesRelations = relations(notesTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [notesTable.organizationId],
    references: [organizationsTable.id],
  }),
  creator: one(usersTable, {
    fields: [notesTable.creatorId],
    references: [usersTable.id],
  }),
}));
