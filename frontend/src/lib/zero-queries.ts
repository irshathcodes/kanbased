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
