import { Z } from "./zero-cache";

export function getBoardsListQuery(z: Z) {
  const boardsQuery = z.query.boardsTable
    .where("deletedAt", "IS", null)
    .orderBy("createdAt", "asc");
  return boardsQuery;
}
