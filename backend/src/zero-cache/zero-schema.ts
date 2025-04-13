// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
// for more complex examples, including many-to-many.

import { ANYONE_CAN, definePermissions } from "@rocicorp/zero";
import { createZeroSchema } from "drizzle-zero";
import * as drizzleSchema from "../db/schema/index.js";

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
    boardsTable: {
      id: true,
      boardUrl: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      creatorId: true,
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
      organizationId: true,
      creatorId: true,
    },
    tasksTable: {
      id: true,
      columnId: true,
      createdAt: true,
      deletedAt: true,
      name: true,
      position: true,
      updatedAt: true,
      organizationId: true,
      creatorId: true,
      content: true,
    },
    notesTable: {
      id: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      name: true,
      content: true,
      deletedAt: true,
      creatorId: true,
    },
  },
  manyToMany: {
    organizationsTable: {
      orgToUsers: [
        {
          sourceField: ["id"],
          destTable: "membersTable",
          destField: ["organizationId"],
        },
        {
          sourceField: ["userId"],
          destTable: "usersTable",
          destField: ["id"],
        },
      ],
    },
  },
  debug:
    typeof process !== "undefined" && process.env.NODE_ENV === "development",
});

export type Schema = typeof schema;

// Define the authentication data type that will be passed to permission rules
type AuthData = {
  sub: string; // User ID
  activeOrganizationId: string;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    boardsTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    columnsTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    tasksTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    usersTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    organizationsTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    membersTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
    notesTable: {
      row: {
        select: ANYONE_CAN,
      },
    },
  };
});
