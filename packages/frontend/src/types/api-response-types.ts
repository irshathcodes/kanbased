import { Api200Response } from "./type-helpers";

// Board list response type
export type BoardListResponse = Api200Response<"/api/v1/boards", "get">;

// Columns response type
export type ColumnsWithTasksResponse = Api200Response<"/api/v1/columns", "get">;

// Note list response type
export type NoteListResponse = Api200Response<"/api/v1/notes", "get">;

// Note response type
export type NoteResponse = Api200Response<"/api/v1/notes/{noteId}", "get">;
