import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notePermissionsTable, notesTable } from "../db/schema/index.js";
import type { InsertType } from "../db/table-types.js";
import type { AuthCtx } from "../lib/types.js";
import { PermissionError } from "../lib/error-utils.js";

type PermissionParams = {
  action: 'create';
} | {
  action: 'read';
  noteId: string;
} | {
  action: 'update';
  noteId: string;
} | {
  action: 'delete';
  noteId: string;
}


async function checkNotePermission(authCtx: AuthCtx, params: PermissionParams) {
  if (params.action === "create") {
    // any user can create a note for now.
    return true;
  }

  const permissions = await db.select().from(notePermissionsTable).where(
    and(
      eq(notePermissionsTable.noteId, params.noteId),
      eq(notePermissionsTable.userId, authCtx.user.id),
      eq(notePermissionsTable.organizationId, authCtx.session.activeOrganizationId),
    )
  )

  if (permissions.length === 0) {
    throw new PermissionError("You do not have permission to access this note");
  }

  const permission = permissions[0]!;

  if (params.action === "read") {
    return permission.permission === "owner" || permission.permission === "editor" || permission.permission === "viewer";
  }

  if (params.action === "update") {
    return permission.permission === "owner" || permission.permission === "editor";
  }

  if (params.action === "delete") {
    return permission.permission === "owner";
  }
}

export const createNote = async (authCtx: AuthCtx, data: InsertType<"notesTable">) => {
  await checkNotePermission(authCtx, { action: "create" });

  const note = await db.insert(notesTable).values(data).returning();

  return note[0]!;
}