import {
  NOBODY_CAN,
  definePermissions,
  type ExpressionBuilder,
  type PermissionsConfig,
  type PermissionRule,
} from "@rocicorp/zero";
import { schema, type Schema } from "../../zero-schema.gen.js";

export { schema, type Schema };

// Define the authentication data type that will be passed to permission rules
type AuthData = {
  sub: string; // User ID
  activeOrganizationId: string;
  role: "member" | "admin" | "owner";
};

type TableName = keyof Schema["tables"];

function and<TTable extends TableName>(
  ...rules: PermissionRule<AuthData, Schema, TTable>[]
): PermissionRule<AuthData, Schema, TTable> {
  return (authData, eb) => eb.and(...rules.map((rule) => rule(authData, eb)));
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const userIsLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, TableName>,
  ) => cmpLit(authData.sub, "IS NOT", null);

  const userIsOwnerOrAdmin = (
    authData: AuthData,
    { cmpLit, or }: ExpressionBuilder<Schema, TableName>,
  ) =>
    or(
      cmpLit(authData.role, "=", "owner"),
      cmpLit(authData.role, "=", "admin"),
    );

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

  const organizationsBelongToUser = (
    authData: AuthData,
    { exists }: ExpressionBuilder<Schema, "organizationsTable">,
  ) =>
    exists("members", (q) =>
      q.where((eb) => eb.cmp("userId", "=", authData.sub)),
    );

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
        select: [and(userIsLoggedIn, membersBelongToActiveOrg)],
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
        select: [and(userIsLoggedIn, organizationsBelongToUser)],
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
        select: [and(userIsLoggedIn, itemsBelongToActiveOrg)],
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
        select: [and(userIsLoggedIn, itemsBelongToActiveOrg)],
        insert: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
        update: {
          preMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
          postMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
        },
        delete: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
      },
    },

    columnsTable: {
      row: {
        select: [and(userIsLoggedIn, itemsBelongToActiveOrg)],
        insert: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
        update: {
          preMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
          postMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
        },
        delete: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
      },
    },

    tasksTable: {
      row: {
        select: [and(userIsLoggedIn, itemsBelongToActiveOrg)],
        insert: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
        update: {
          preMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
          postMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
        },
        delete: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
      },
    },

    notesTable: {
      row: {
        select: [and(userIsLoggedIn, itemsBelongToActiveOrg)],
        insert: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
        update: {
          preMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
          postMutation: [
            and(
              userIsLoggedIn,
              userIsOwnerOrAdmin,
              itemsBelongToActiveOrg,
              loggedInUserIsCreator,
            ),
          ],
        },
        delete: [
          and(
            userIsLoggedIn,
            userIsOwnerOrAdmin,
            itemsBelongToActiveOrg,
            loggedInUserIsCreator,
          ),
        ],
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
