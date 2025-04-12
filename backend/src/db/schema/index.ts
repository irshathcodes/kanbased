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
};

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    boards: many(boardsTable),
    users: many(usersTable),
    members: many(membersTable),
    invitations: many(invitationsTable),
    notes: many(notesTable),
    sessions: many(sessionsTable),
    boardPermissions: many(boardPermissionsTable),
    notePermissions: many(notePermissionsTable),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  organizations: many(organizationsTable),
  members: many(membersTable),
  invitations: many(invitationsTable),
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  boardPermissions: many(boardPermissionsTable),
  notePermissions: many(notePermissionsTable),
}));

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [sessionsTable.activeOrganizationId],
    references: [organizationsTable.id],
  }),
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
  id: t.uuid().primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  color: t.varchar({ length: 255 }),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp().notNull(),
  deletedAt: t.timestamp(),
  boardUrl: t.text().notNull(),
  organizationId: t
    .text()
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const boardsRelations = relations(boardsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [boardsTable.organizationId],
    references: [organizationsTable.id],
  }),
  columns: many(columnsTable),
  boardPermissions: many(boardPermissionsTable),
}));

export const columnsTable = pgTable(
  "columns",
  {
    id: t.uuid().primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
    boardId: t
      .uuid()
      .references(() => boardsTable.id, { onDelete: "cascade" })
      .notNull(),
    position: t.integer().notNull(),
    createdAt: t.timestamp(),
    updatedAt: t.timestamp().notNull(),
    deletedAt: t.timestamp(),
  },
  (table) => [t.index("column_board_idx").on(table.boardId)],
);

export const columnsRelations = relations(columnsTable, ({ one, many }) => ({
  board: one(boardsTable, {
    fields: [columnsTable.boardId],
    references: [boardsTable.id],
  }),
  tasks: many(tasksTable),
}));

export const tasksTable = pgTable(
  "tasks",
  {
    id: t.uuid().primaryKey(),
    name: t.text().notNull(),
    columnId: t
      .uuid()
      .references(() => columnsTable.id, { onDelete: "cascade" })
      .notNull(),
    position: t.doublePrecision().notNull(),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp().notNull(),
    deletedAt: t.timestamp(),
  },
  (table) => [t.index("column_id_idx").on(table.columnId)],
);

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  column: one(columnsTable, {
    fields: [tasksTable.columnId],
    references: [columnsTable.id],
  }),
  taskMarkdown: one(taskMarkdownTable, {
    fields: [tasksTable.id],
    references: [taskMarkdownTable.taskId],
  }),
}));

export const boardPermissionsTable = pgTable(
  "board_permissions",
  {
    id: t.serial().primaryKey(),
    boardId: t
      .uuid()
      .references(() => boardsTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: t
      .text()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: t
      .text()
      .references(() => organizationsTable.id, { onDelete: "cascade" })
      .notNull(),
    permission: t.varchar({ length: 255 }).notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
  },
  (table) => [
    // Ensure user can only have one role per board
    t
      .unique("unique_board_member")
      .on(table.boardId, table.userId, table.organizationId),
    t.index("board_members_user_idx").on(table.userId),
    t.index("board_members_board_idx").on(table.boardId),
    t.index("board_members_organization_idx").on(table.organizationId),
  ],
);

export const boardPermissionsRelations = relations(
  boardPermissionsTable,
  ({ one }) => ({
    board: one(boardsTable, {
      fields: [boardPermissionsTable.boardId],
      references: [boardsTable.id],
    }),
    user: one(usersTable, {
      fields: [boardPermissionsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const taskMarkdownTable = pgTable("task_markdown", {
  taskId: t
    .uuid()
    .references(() => tasksTable.id, { onDelete: "cascade" })
    .primaryKey(),
  content: t.text(),
  ...commonColumns,
});

export const taskMarkdownRelations = relations(
  taskMarkdownTable,
  ({ one }) => ({
    task: one(tasksTable, {
      fields: [taskMarkdownTable.taskId],
      references: [tasksTable.id],
    }),
  }),
);

export const notesTable = pgTable("notes", {
  id: t.uuid().primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp().notNull(),
  deletedAt: t.timestamp(),
  organizationId: t
    .text()
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const notesRelations = relations(notesTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [notesTable.organizationId],
    references: [organizationsTable.id],
  }),
  notePermissions: many(notePermissionsTable),
}));

export const notePermissionsTable = pgTable(
  "note_permissions",
  {
    id: t.serial().primaryKey(),
    noteId: t
      .uuid()
      .references(() => notesTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: t
      .text()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: t
      .text()
      .references(() => organizationsTable.id, { onDelete: "cascade" })
      .notNull(),
    permission: t
      .varchar({ length: 255, enum: ["owner", "editor", "viewer"] })
      .notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
  },
  (table) => [
    // Ensure user can only have one role per board
    t
      .unique("unique_note_member")
      .on(table.noteId, table.userId, table.organizationId),
    t.index("note_members_user_idx").on(table.userId),
    t.index("note_members_note_idx").on(table.noteId),
    t.index("note_members_organization_idx").on(table.organizationId),
  ],
);

export const notePermissionsRelations = relations(
  notePermissionsTable,
  ({ one }) => ({
    note: one(notesTable, {
      fields: [notePermissionsTable.noteId],
      references: [notesTable.id],
    }),
    user: one(usersTable, {
      fields: [notePermissionsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
