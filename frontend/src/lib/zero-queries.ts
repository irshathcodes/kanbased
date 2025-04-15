import { Row } from "@rocicorp/zero";
import { Z } from "./zero-cache";
import { ZeroQueryResult } from "@/types/type-helpers";

export function getBoardsListQuery(z: Z) {
  const boardsQuery = z.query.boardsTable
    .where("deletedAt", "IS", null)
    .orderBy("createdAt", "asc");
  return boardsQuery;
}

export type BoardsListResult = ZeroQueryResult<typeof getBoardsListQuery>[];
