import { paths } from "@/types/api-schema";

type AvailablePaths = keyof paths;
// @ts-ignore
export type Api200Response<
  TPath extends AvailablePaths,
  TMethod extends keyof paths[TPath],
> = paths[TPath][TMethod]["responses"]["200"]["content"]["application/json"];
