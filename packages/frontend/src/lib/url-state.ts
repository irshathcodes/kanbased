import { router } from "@/main";
import { routeTree } from "@/routeTree.gen";
import { getRouteApi, RouteIds } from "@tanstack/react-router";
import { UseSearchResult } from "node_modules/@tanstack/react-router/dist/esm/useSearch";
import { Constrain } from "node_modules/@tanstack/react-router/dist/esm/utils";

type SearchParamResult<TPath> = UseSearchResult<
  typeof router,
  TPath,
  true,
  unknown
>;

export class UrlState<
  TPath extends Constrain<string, RouteIds<typeof routeTree>>,
> {
  private route;

  constructor(path: TPath) {
    this.route = getRouteApi(path);
  }

  use(key: keyof SearchParamResult<TPath>) {
    const search = this.route.useSearch();
    const state = search[key];

    return {
      state,
      set: (updatedValue: typeof state, replace?: boolean) => {
        this.set(key, updatedValue, replace);
      },
      remove: (replace?: boolean) => {
        this.remove(key, replace);
      },
    };
  }

  set<TKey extends keyof SearchParamResult<TPath>>(
    key: TKey,
    updatedValue: SearchParamResult<TPath>[TKey],
    replace?: boolean,
  ) {
    router.navigate({
      // @ts-expect-error
      search: (prev) => ({
        ...prev,
        [key]: updatedValue,
      }),
      replace,
    });
  }

  remove<TKey extends keyof SearchParamResult<TPath>>(
    key: TKey,
    replace?: boolean,
  ) {
    router.navigate({
      // @ts-expect-error
      search: (prev) => ({
        ...prev,
        [key]: undefined,
      }),
      replace,
    });
  }
}
