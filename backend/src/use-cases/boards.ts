import type { InsertType } from "../db/table-types.js";
import { db, type DbTypeOrTransaction } from "../db/index.js";
import { db as database } from "../db/index.js";
import {
  boardPermissionsTable,
  boardsTable,
  columnsTable,
  tasksTable,
} from "../db/schema/index.js";
import { and, count, eq, isNull, desc } from "drizzle-orm";
import { checkResourceAccess } from "./permissions.js";
import { UnprocessableEntityError } from "../lib/error-utils.js";
import type { AuthCtx } from "../lib/types.js";

export async function createBoard(
  authCtx: AuthCtx,
  body: Omit<InsertType<"boardsTable">, "organizationId">,
  db: DbTypeOrTransaction = database
) {
  await assertBoardNameIsUnique(authCtx, body.name, db);

  const res = await db.transaction(async (tx) => {
    const [createdBoard] = await tx
      .insert(boardsTable)
      .values({
        name: body.name,
        color: body.color,
        organizationId: authCtx.session.activeOrganizationId,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        boardUrl: body.boardUrl,
        id: body.id,
      })
      .returning();

    await tx.insert(boardPermissionsTable).values({
      boardId: createdBoard!.id,
      organizationId: authCtx.session.activeOrganizationId,
      permission: "owner",
      userId: authCtx.user.id,
      createdAt: new Date(),
    });

    return createdBoard;
  });

  return res!;
}

export async function assertBoardNameIsUnique(authCtx: AuthCtx, name: string, db: DbTypeOrTransaction = database) {
  const boards = await db
    .select({ boardId: boardsTable.id })
    .from(boardsTable)
    .where(
      and(
        eq(boardsTable.organizationId, authCtx.session.activeOrganizationId),
        eq(boardsTable.name, name),
        isNull(boardsTable.deletedAt)
      )
    );

  if (boards.length > 0) {
    throw new UnprocessableEntityError("Board name must be unique");
  }
}

export async function getBoards(authCtx: AuthCtx) {
  return db
    .select({
      id: boardsTable.id,
      name: boardsTable.name,
      color: boardsTable.color,
      boardUrl: boardsTable.boardUrl,
      tasksCount: count(tasksTable.id),
      columnsCount: count(columnsTable.id),
    })
    .from(boardsTable)
    .innerJoin(
      boardPermissionsTable,
      eq(boardPermissionsTable.boardId, boardsTable.id),
    )
    .leftJoin(columnsTable, eq(columnsTable.boardId, boardsTable.id))
    .leftJoin(tasksTable, eq(tasksTable.columnId, columnsTable.id))
    .where(
      and(
        eq(boardPermissionsTable.userId, authCtx.user.id),
        eq(boardsTable.organizationId, authCtx.session.activeOrganizationId),
        isNull(boardsTable.deletedAt)
      ),
    )
    .groupBy(boardsTable.id)
    .orderBy(desc(boardsTable.createdAt));
}

export async function toggleBoardDelete(
  authCtx: AuthCtx,
  boardId: string,
  deleted: boolean
) {
  await checkResourceAccess(authCtx, boardId, "board", "admin");

  const [updatedBoard] = await db
    .update(boardsTable)
    .set({ deletedAt: deleted ? new Date() : null })
    .where(eq(boardsTable.id, boardId))
    .returning();

  return updatedBoard!;
}

export async function editBoard(
  authCtx: AuthCtx,
  boardId: string,
  body: Omit<InsertType<"boardsTable">, "creatorId" | "id" | 'organizationId'>
) {
  await checkResourceAccess(authCtx, boardId, "board", "editor");

  await assertBoardNameIsUnique(authCtx, body.name);

  await db.update(boardsTable).set(body).where(eq(boardsTable.id, boardId));
}

