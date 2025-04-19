import { Session, User } from "better-auth/types";
import { Query, Row, Schema, TableSchema } from "@rocicorp/zero";

export type GetSessionResponse = {
  session: Session & { activeOrganizationId: string | null };
  user: User;
};

export type ZeroQueryResult<
  T extends (...args: any) => TableSchema | Query<Schema, string, any>,
> = Row<ReturnType<T>>;
