import { and, eq, inArray } from "drizzle-orm";
import { db, type DbTypeOrTransaction } from "../db/index.js";
import {
  boardPermissionsTable, columnsTable, tasksTable
} from "../db/schema/index.js";
import { PermissionError } from "../lib/error-utils.js";
import type { AuthCtx } from "../lib/types.js";

const permissionLevels: Record<ResourcePermission, number> = {
  owner: 3,
  admin: 2,
  editor: 1,
  viewer: 0,
};

export type ResourcePermission = "owner" | "admin" | "editor" | "viewer";
export type ResourceType = "board" | "column" | "task";

/**
 * Checks if the user has the required permission for a given resource.
 * Throws a `PermissionError` if the user does not have permission.
 */
export async function checkResourceAccess(
  authCtx: AuthCtx,
  resourceId: string | string[],
  resourceType: ResourceType,
  requiredPermission: ResourcePermission,
  db_or_tx: DbTypeOrTransaction = db
): Promise<void> {
  let query = db_or_tx
    .select({
      permission: boardPermissionsTable.permission,
      resourceId:
        resourceType === "board"
          ? boardPermissionsTable.boardId
          : resourceType === "column"
            ? columnsTable.id
            : tasksTable.id,
    })
    .from(boardPermissionsTable)
    .$dynamic();

  switch (resourceType) {
    case "board":
      query = query.where(
        and(
          eq(boardPermissionsTable.userId, authCtx.user.id),
          eq(boardPermissionsTable.organizationId, authCtx.session.activeOrganizationId),
          Array.isArray(resourceId)
            ? inArray(boardPermissionsTable.boardId, resourceId)
            : eq(boardPermissionsTable.boardId, resourceId)
        )
      );
      break;

    case "column":
      query = query
        .innerJoin(
          columnsTable,
          eq(columnsTable.boardId, boardPermissionsTable.boardId)
        )
        .where(
          and(
            eq(boardPermissionsTable.userId, authCtx.user.id),
            eq(boardPermissionsTable.organizationId, authCtx.session.activeOrganizationId),
            Array.isArray(resourceId)
              ? inArray(columnsTable.id, resourceId)
              : eq(columnsTable.id, resourceId)
          )
        );
      break;

    case "task":
      query = query
        .innerJoin(
          columnsTable,
          eq(columnsTable.boardId, boardPermissionsTable.boardId)
        )
        .innerJoin(tasksTable, eq(tasksTable.columnId, columnsTable.id))
        .where(
          and(
            eq(boardPermissionsTable.userId, authCtx.user.id),
            eq(boardPermissionsTable.organizationId, authCtx.session.activeOrganizationId),
            Array.isArray(resourceId)
              ? inArray(tasksTable.id, resourceId)
              : eq(tasksTable.id, resourceId)
          )
        );
      break;
  }

  const results = await query;

  // Handle case where no results found
  if (!results?.length) {
    throw new PermissionError();
  }

  if (Array.isArray(resourceId)) {
    // Create a Set of found resource IDs for O(1) lookup
    const foundResourceIds = new Set(results.map((r) => r.resourceId));

    // Verify we got back the same number of results as requested IDs
    if (foundResourceIds.size !== resourceId.length) {
      throw new PermissionError();
    }

    // Check if all requested IDs exist and have sufficient permissions
    for (const id of resourceId) {
      if (!foundResourceIds.has(id)) {
        throw new PermissionError();
      }
    }
  }

  // Check permissions for all results
  for (const result of results) {
    const hasPermission =
      permissionLevels[result.permission as ResourcePermission] >=
      permissionLevels[requiredPermission];

    if (!hasPermission) {
      throw new PermissionError();
    }
  }
}

