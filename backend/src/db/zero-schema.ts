// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
// for more complex examples, including many-to-many.

import { definePermissions, ANYONE_CAN } from "@rocicorp/zero";
import { createZeroSchema } from "drizzle-zero";
import * as drizzleSchema from "./schema/index.js";
import { env } from "../env.js";

export const schema = createZeroSchema(drizzleSchema, {
  casing: "snake_case",
  tables: {
    usersTable: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      emailVerified: true,
      image: true,
    },
    organizationsTable: {
      id: true,
      name: true,
      createdAt: true,
      slug: true,
      logo: true,
      metadata: true,
    },
    accountsTable: false,
    verificationsTable: false,
    sessionsTable: false,
    invitationsTable: false,
    membersTable: {
      id: true,
      createdAt: true,
      organizationId: true,
      role: true,
      userId: true,
    },
    boardPermissionsTable: {
      boardId: true,
      createdAt: true,
      id: true,
      organizationId: true,
      userId: true,
      permission: true,
    },
    boardsTable: {
      id: true,
      boardUrl: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      name: true,
      color: true,
      deletedAt: true,
    },
    columnsTable: {
      id: true,
      boardId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      name: true,
      position: true,
    },
    tasksTable: {
      id: true,
      columnId: true,
      createdAt: true,
      deletedAt: true,
      name: true,
      position: true,
      updatedAt: true,
    },
    notePermissionsTable: {
      id: true,
      noteId: true,
      permission: true,
      createdAt: true,
      userId: true,
      organizationId: true,
    },
    notesTable: {
      id: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      name: true,
      content: true,
      deletedAt: true,
    },
    taskMarkdownTable: {
      content: true,
      createdAt: true,
      taskId: true,
      updatedAt: true,
    },
  },
  debug: env.NODE_ENV === "development",
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => {
  return {};
});
