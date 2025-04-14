ALTER TABLE "board_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "note_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "task_markdown" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "board_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "note_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "task_markdown" CASCADE;--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "columns" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "columns" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "columns" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "columns" ADD CONSTRAINT "columns_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "columns" ADD CONSTRAINT "columns_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;