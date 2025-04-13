ALTER TABLE "zero_notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "zero_notes" CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_active_organization_id_organization_id_fk" FOREIGN KEY ("active_organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;