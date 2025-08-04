import type {Z} from "./zero-cache";
import type {ZeroQueryResult} from "@/types/type-helpers";

export function getBoardsListQuery(z: Z) {
  const boardsQuery = z.query.boardsTable.where("deletedAt", "IS", null);
  return boardsQuery;
}

export type GetBoardsListQueryResult = Array<
  ZeroQueryResult<typeof getBoardsListQuery>
>;

export function getNotesListQuery(z: Z) {
  return z.query.notesTable.where("deletedAt", "IS", null);
}

export type GetNotesListQueryResult = Array<
  ZeroQueryResult<typeof getNotesListQuery>
>;

export function getNoteQuery(z: Z, noteId: string) {
  return z.query.notesTable.where("id", noteId).one();
}

export type GetNoteQueryResult = ZeroQueryResult<typeof getNoteQuery>;

export function getBoardWithColumnsAndTasksQuery(z: Z, boardId: string) {
  return z.query.boardsTable
    .where("id", boardId)
    .related("columns", (q) =>
      q
        .where("deletedAt", "IS", null)
        .related("tasks", (q) =>
          q
            .where("deletedAt", "IS", null)
            .related("assignee")
            .orderBy("position", "asc"),
        )
        .orderBy("position", "asc"),
    )
    .where("deletedAt", "IS", null)
    .one();
}

export type GetBoardWithColumnsAndTasksQueryResult = ZeroQueryResult<
  typeof getBoardWithColumnsAndTasksQuery
>;

export function getTaskQuery(z: Z, taskId: string) {
  return z.query.tasksTable
    .where("id", taskId)
    .where("deletedAt", "IS", null)
    .related("assignee")
    .one();
}

export type GetTaskQueryResult = ZeroQueryResult<typeof getTaskQuery>;

export function getOrganizationListQuery(z: Z) {
  return z.query.organizationsTable;
}

export type GetOrganizationListQueryResult = Array<
  ZeroQueryResult<typeof getOrganizationListQuery>
>;

export function allBoardsQuery(z: Z) {
  return z.query.boardsTable
    .where("deletedAt", "IS", null)
    .related("columns", (q) =>
      q
        .where("deletedAt", "IS", null)
        .related("tasks", (q) => q.where("deletedAt", "IS", null)),
    );
}

export type AllBoardsQueryResult = Array<
  ZeroQueryResult<typeof allBoardsQuery>
>;

export function getOrganizationQuery(z: Z, orgId: string) {
  return z.query.organizationsTable.where("id", orgId).one();
}

export type GetOrganizationQueryResult = ZeroQueryResult<
  typeof getOrganizationQuery
>;

export function getOrganizationMembersQuery(z: Z, orgId: string) {
  return z.query.membersTable
    .where("organizationId", orgId)
    .related("user", (q) => q.orderBy("name", "asc"));
}

export type GetOrganizationMembersQueryResult = Array<
  ZeroQueryResult<typeof getOrganizationMembersQuery>
>;

export type OrganizationMember = NonNullable<
  NonNullable<GetOrganizationMembersQueryResult>[number]["user"]
>;

let didPreloadAllBoards = false;

export function preloadAllBoards(z: Z) {
  if (didPreloadAllBoards) {
    return;
  }

  didPreloadAllBoards = true;

  return allBoardsQuery(z).preload({ttl: "forever"});
}
