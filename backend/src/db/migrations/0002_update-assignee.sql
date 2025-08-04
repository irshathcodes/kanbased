-- Custom SQL migration file, put your code below! --
UPDATE tasks SET "assigneeId" = creator_id;
