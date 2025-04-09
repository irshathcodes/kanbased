import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { isMatch, Link, LinkProps, useMatches } from "@tanstack/react-router";

export interface BreadcrumbsData {
  breadcrumbs: (LinkProps & { label: string })[];
}

export function TsrBreadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) => isMatch(match, "loaderData.breadcrumbs"))
    .flatMap((match) => match.loaderData?.breadcrumbs!);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map(({ label, ...linkProps }, index, arr) => {
          const isTail = index === arr.length - 1;

          if (isTail) {
            return (
              <BreadcrumbItem key={label}>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={linkProps.to}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link {...linkProps}>{label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
