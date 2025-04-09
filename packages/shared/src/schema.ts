// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/schema.ts
// for more complex examples, including many-to-many.

import {
  table,
  string,
  number,
  createSchema,
  definePermissions,
  ANYONE_CAN,
} from "@rocicorp/zero";

const notes = table("zero_notes")
  .columns({
    id: string(),
    title: string(),
    content: string(),
    timestamp: number(),
  })
  .primaryKey("id");

export const schema = createSchema({
  tables: [notes],
  relationships: [],
});

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
