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
  const notesQuery = z.query.notesTable.where("deletedAt", "IS", null);
  return notesQuery;
}

export type GetNotesListQueryResult = ZeroQueryResult<
  typeof getNotesListQuery
>[];

export function getNoteQuery(z: Z, noteId: string) {
  const noteQuery = z.query.notesTable.where("id", noteId).one();
  return noteQuery;
}

export type GetNoteQueryResult = ZeroQueryResult<typeof getNoteQuery>;
