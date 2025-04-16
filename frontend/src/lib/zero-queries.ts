import { Z } from "./zero-cache";
import { ZeroQueryResult } from "@/types/type-helpers";

export function getBoardsListQuery(z: Z) {
  const boardsQuery = z.query.boardsTable.where("deletedAt", "IS", null);
  return boardsQuery;
}

export type GetBoardsListQueryResult = ZeroQueryResult<
  typeof getBoardsListQuery
>[];

export function getNotesListQuery(z: Z) {
  return z.query.notesTable.where("deletedAt", "IS", null);
}

export type GetNotesListQueryResult = ZeroQueryResult<
  typeof getNotesListQuery
>[];

export function getNoteQuery(z: Z, noteId: string) {
  return z.query.notesTable.where("id", noteId).one();
}

export type GetNoteQueryResult = ZeroQueryResult<typeof getNoteQuery>;

export function getBoardWithColumnsAndTasksQuery(z: Z, slug: string) {
  return z.query.boardsTable
    .where("slug", slug)
    .related("columns", (q) =>
      q
        .where("deletedAt", "IS", null)
        .related("tasks", (q) =>
          q.where("deletedAt", "IS", null).orderBy("position", "asc"),
        )
        .orderBy("position", "asc"),
    )
    .where("deletedAt", "IS", null)
    .one();
}

export type GetBoardWithColumnsAndTasksQueryResult = ZeroQueryResult<
  typeof getBoardWithColumnsAndTasksQuery
>;
