// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
// for more complex examples, including many-to-many.

import {
  ANYONE_CAN,
  NOBODY_CAN,
  definePermissions,
  type ExpressionBuilder,
  type PermissionsConfig,
} from "@rocicorp/zero";
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
  role: "member" | "admin" | "owner";
};

type TableName = keyof Schema["tables"];

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const userIsLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.sub, "IS NOT", null);

  const userIsAdmin = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.role, "=", "admin");

  const userIsOwner = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.role, "=", "owner");

  const userIsOwnerOrAdmin = (
    authData: AuthData,
    { cmpLit, or }: ExpressionBuilder<Schema, TableName>,
  ) =>
    or(
      cmpLit(authData.role, "=", "owner"),
      cmpLit(authData.role, "=", "admin"),
    );

  const userIsMember = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.role, "=", "member");

  const loggedInUserIsCreator = (
    authData: AuthData,
    eb: ExpressionBuilder<
      Schema,
      "boardsTable" | "columnsTable" | "tasksTable" | "notesTable"
    >,
  ) => eb.cmp("creatorId", "=", authData.sub);

  const membersBelongToActiveOrg = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "usersTable">,
  ) =>
    exists("members", (q) =>
      q.where((eb) =>
        eb.cmp("organizationId", "=", authData.activeOrganizationId),
      ),
    );

  const allowIfActiveOrg = (
    authData: AuthData,
    { cmp }: ExpressionBuilder<Schema, "organizationsTable">,
  ) => cmp("id", "=", authData.activeOrganizationId);

  const itemsBelongToActiveOrg = (
    authData: AuthData,
    {
      cmp,
    }: ExpressionBuilder<
      Schema,
      | "boardsTable"
      | "columnsTable"
      | "tasksTable"
      | "notesTable"
      | "membersTable"
    >,
  ) => cmp("organizationId", "=", authData.activeOrganizationId);

  return {
    // Users table - only allow select access to users
    usersTable: {
      row: {
        select: [userIsLoggedIn, membersBelongToActiveOrg],
        insert: NOBODY_CAN, // User creation handled by auth system
        update: {
          preMutation: NOBODY_CAN, // User updates handled by auth system
          postMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN, // User deletion handled by auth system
      },
    },

    // Organizations table - users can only see orgs they are members of
    organizationsTable: {
      row: {
        select: [userIsLoggedIn, allowIfActiveOrg],
        insert: NOBODY_CAN, // Org creation handled elsewhere
        update: {
          preMutation: NOBODY_CAN,
          postMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN, // Org deletion handled elsewhere
      },
    },

    // Members table - users can only see members of their active organization
    membersTable: {
      row: {
        select: [userIsLoggedIn, itemsBelongToActiveOrg],
        insert: NOBODY_CAN, // Member management handled elsewhere
        update: {
          preMutation: NOBODY_CAN,
          postMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },

    boardsTable: {
      row: {
        select: [userIsLoggedIn, itemsBelongToActiveOrg],
        insert: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
        update: {
          preMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
          postMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
        },
        delete: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
      },
    },

    columnsTable: {
      row: {
        select: [userIsLoggedIn, itemsBelongToActiveOrg],
        insert: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
        update: {
          preMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
          postMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
        },
        delete: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
      },
    },

    tasksTable: {
      row: {
        select: [userIsLoggedIn, itemsBelongToActiveOrg],
        insert: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
        update: {
          preMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
          postMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
        },
        delete: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
      },
    },

    notesTable: {
      row: {
        select: [userIsLoggedIn, itemsBelongToActiveOrg],
        insert: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
        update: {
          preMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
          postMutation: [
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ],
        },
        delete: [
          userIsLoggedIn,
          userIsOwnerOrAdmin,
          itemsBelongToActiveOrg,
          loggedInUserIsCreator,
        ],
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
