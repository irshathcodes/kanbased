ALTER TABLE "board_permissions" DROP CONSTRAINT "unique_board_member";--> statement-breakpoint

-- First add the column as nullable
ALTER TABLE "board_permissions" ADD COLUMN "organization_id" text;--> statement-breakpoint

-- Here you should add a data migration to populate organization_id for existing rows
-- For example:
UPDATE "board_permissions" bp
SET organization_id = (SELECT organization_id FROM boards WHERE id = bp.board_id);

-- Then make it NOT NULL after data is populated
ALTER TABLE "board_permissions" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "board_permissions" ADD CONSTRAINT "board_permissions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "board_members_organization_idx" ON "board_permissions" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "board_permissions" ADD CONSTRAINT "unique_board_member" UNIQUE("board_id","user_id","organization_id");