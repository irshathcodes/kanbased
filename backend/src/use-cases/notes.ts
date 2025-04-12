import { and, eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { notePermissionsTable, notesTable } from "../db/schema/index.js";
import type { InsertType } from "../db/table-types.js";
import type { AuthCtx } from "../lib/types.js";
import { PermissionError } from "../lib/error-utils.js";

type PermissionParams =
  | {
    action: "create";
  }
  | {
    action: "read";
    noteId: string;
  }
  | {
    action: "update";
    noteId: string;
  }
  | {
    action: "delete";
    noteId: string;
  };

async function checkNotePermission(authCtx: AuthCtx, params: PermissionParams) {
  if (params.action === "create") {
    // any user can create a note for now.
    return true;
  }

  const permissions = await db
    .select()
    .from(notePermissionsTable)
    .where(
      and(
        eq(notePermissionsTable.noteId, params.noteId),
        eq(notePermissionsTable.userId, authCtx.user.id),
        eq(
          notePermissionsTable.organizationId,
          authCtx.session.activeOrganizationId
        )
      )
    );

  if (permissions.length === 0) {
    throw new PermissionError("You do not have permission to access this note");
  }

  const permission = permissions[0]!;

  if (params.action === "read") {
    return (
      permission.permission === "owner" ||
      permission.permission === "editor" ||
      permission.permission === "viewer"
    );
  }

  if (params.action === "update") {
    return (
      permission.permission === "owner" || permission.permission === "editor"
    );
  }

  if (params.action === "delete") {
    return permission.permission === "owner";
  }
}

export const createNote = async (
  authCtx: AuthCtx,
  data: Pick<InsertType<"notesTable">, "content" | "name" | "createdAt" | "id">
) => {
  await checkNotePermission(authCtx, { action: "create" });
  const createdAt = data.createdAt ? data.createdAt : new Date();

  const createdNote = db.transaction(async (tx) => {
    const result = await db
      .insert(notesTable)
      .values({
        ...data,
        organizationId: authCtx.session.activeOrganizationId,
        updatedAt: createdAt,
        createdAt,
      })
      .returning();

    const note = result[0]!;

    await tx
      .insert(notePermissionsTable)
      .values({
        noteId: note.id,
        userId: authCtx.user.id,
        organizationId: authCtx.session.activeOrganizationId,
        permission: "owner",
      });

    return note;
  });

  return createdNote;
};

export const updateNote = async (
  authCtx: AuthCtx,
  noteId: string,
  data: Pick<InsertType<"notesTable">, "content" | "updatedAt" | "name">
) => {
  await checkNotePermission(authCtx, { action: "update", noteId });

  const note = await db
    .update(notesTable)
    .set(data)
    .where(eq(notesTable.id, noteId))
    .returning();

  return note[0]!;
};

export const getNote = async (authCtx: AuthCtx, noteId: string) => {
  await checkNotePermission(authCtx, { action: "read", noteId });

  const note = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, noteId));

  return note[0]!;
};

export const getAllNotes = async (authCtx: AuthCtx) => {
  const notes = await db
    .select({
      name: notesTable.name,
      id: notesTable.id,
      updatedAt: notesTable.updatedAt,
    })
    .from(notesTable)
    .innerJoin(
      notePermissionsTable,
      eq(notesTable.id, notePermissionsTable.noteId)
    )
    .where(
      and(
        eq(notePermissionsTable.userId, authCtx.user.id),
        eq(
          notePermissionsTable.organizationId,
          authCtx.session.activeOrganizationId
        )
      )
    )
    .orderBy(desc(notesTable.createdAt));

  return notes;
};
