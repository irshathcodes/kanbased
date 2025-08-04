ALTER TABLE "tasks" ADD COLUMN "assigneeId" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_user_id_fk" FOREIGN KEY ("assigneeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;

