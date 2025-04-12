import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { membersTable } from "../db/schema/index.js";

export async function getActiveOrganization(userId: string): Promise<string | undefined> {
  const organization = await db
    .select({ organizationId: membersTable.organizationId })
    .from(membersTable)
    .where(eq(membersTable.userId, userId))
    .limit(1);

  return organization?.[0]?.organizationId;
}
