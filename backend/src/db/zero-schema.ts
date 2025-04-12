// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
// for more complex examples, including many-to-many.

import {
  table,
  string,
  createSchema,
  definePermissions,
  ANYONE_CAN,
  number,
} from "@rocicorp/zero";

const notes = table("zero_notes")
  .columns({
    id: string(),
    title: string(),
    content: string(),
    created_at: number(),
    updated_at: number(),
    deleted_at: number(),
  })
  .primaryKey("id");

export const schema = createSchema({
  tables: [notes],
  relationships: [],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => {
  return {
    zero_notes: {
      row: {
        delete: ANYONE_CAN,
        insert: ANYONE_CAN,
        select: ANYONE_CAN,
      },
    },
  };
});
