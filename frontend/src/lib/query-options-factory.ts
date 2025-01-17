import { api } from "@/lib/openapi-react-query";

export function getColumnsQuery(boardName: string) {
  return api.queryOptions("get", '/columns', { params: { query: { boardName } } });
}

export const boardsQuery = api.queryOptions("get", "/boards");
