import { paths } from "@/types/api-schema";
import { Query, Row, Schema, TableSchema } from "@rocicorp/zero";

type AvailablePaths = keyof paths;
export type Api200Response<
  TPath extends AvailablePaths,
  TMethod extends keyof paths[TPath],
  // @ts-ignore
> = paths[TPath][TMethod]["responses"]["200"]["content"]["application/json"];

export type ZeroQueryResult<
  T extends (...args: any) => TableSchema | Query<Schema, string, any>,
> = Row<ReturnType<T>>;
