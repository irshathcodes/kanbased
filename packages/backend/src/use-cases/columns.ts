import { and, eq, inArray, SQL, sql } from "drizzle-orm";
import type { InsertType } from "../db/table-types.js";
import { db, type DbTypeOrTransaction } from "../db/index.js";
import { db as database } from "../db/index.js";
import {
  boardPermissionsTable,
  boardsTable,
  columnsTable,
  tasksTable,
} from "../db/schema/index.js";
import { checkResourceAccess } from "./permissions.js";
import {
  PermissionError
} from "../lib/error-utils.js";
import type { AuthCtx } from "../lib/types.js";

export async function createColumn(
  authCtx: AuthCtx,
  body: InsertType<"columnsTable">,
  db: DbTypeOrTransaction = database
) {
  await checkResourceAccess(authCtx, body.boardId, "board", "admin", db);
  const [createdColumn] = await db.insert(columnsTable).values(body).returning();
  return createdColumn!;
}

export async function reorderColumns(
  authCtx: AuthCtx,
  columns: Pick<InsertType<"columnsTable">, "id" | "position">[]
) {
  const columnIds = columns.map((col) => col.id);

  await checkResourceAccess(authCtx, columnIds, "column", "editor");

  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`(case`);

  for (const column of columns) {
    sqlChunks.push(
      sql`when ${columnsTable.id} = ${column.id} then ${sql.raw(`${column.position}::integer`)}`
    );
  }
  sqlChunks.push(sql`end)`);

  const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

  await db
    .update(columnsTable)
    .set({ position: finalSql })
    .where(inArray(columnsTable.id, columnIds));
}

export async function getColumnsAndTasks(authCtx: AuthCtx, boardUrl: string) {
  const boards = await db
    .select({ boardId: boardsTable.id, boardName: boardsTable.name })
    .from(boardsTable)
    .innerJoin(
      boardPermissionsTable,
      eq(boardPermissionsTable.boardId, boardsTable.id)
    )
    .where(
      and(
        eq(boardsTable.boardUrl, boardUrl),
        eq(boardPermissionsTable.userId, authCtx.user.id)
      )
    );

  if (!boards.length) {
    throw new PermissionError();
  }

  const boardId = boards[0]!.boardId;
  const boardName = boards[0]!.boardName;

  await checkResourceAccess(authCtx, boardId, "board", "viewer");

  // First get columns
  const columns = await db
    .select()
    .from(columnsTable)
    .where(eq(columnsTable.boardId, boardId));

  // Then get tasks for these columns
  const tasks = await db
    .select()
    .from(tasksTable)
    .where(
      inArray(
        tasksTable.columnId,
        columns.map((col) => col.id)
      )
    );

  return { columns, tasks, boardId, boardName };
}

export async function updateColumnName(authCtx: AuthCtx, columnId: string, body: Pick<InsertType<"columnsTable">, 'name'>) {
  await checkResourceAccess(authCtx, columnId, "column", "admin");

  const [updatedCol] = await db
    .update(columnsTable)
    .set(body)
    .where(eq(columnsTable.id, columnId))
    .returning();

  return updatedCol!;
}

export async function deleteColumn(authCtx: AuthCtx, columnId: string) {
  await checkResourceAccess(authCtx, columnId, "column", "admin");
  await db.delete(columnsTable).where(eq(columnsTable.id, columnId));
}