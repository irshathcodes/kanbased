import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImportBoardsModal } from "@/features/boards/board.state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImportIcon, InfoIcon } from "lucide-react";
import { useActiveOrganizationId } from "@/queries/session";
import { useZ } from "@/lib/zero-cache";
import { createId, tryCatch } from "@/lib/utils";
import { AllBoardsQueryResult } from "@/lib/zero-queries";

export function ImportBoards({ onClose }: ImportBoardsModal) {
  const z = useZ();
  const orgId = useActiveOrganizationId();

  const handleImport = async (data: AllBoardsQueryResult) => {
    if (!Array.isArray(data)) {
      toast.error("Invalid JSON data");
      return;
    }

    // TODO: probably have to validate the data first
    // will do that later
    const { error } = await tryCatch(
      z.mutateBatch(async (m) => {
        const now = Date.now();

        for (let board of data) {
          const boardId = createId();

          await m.boardsTable.insert({
            id: boardId,
            name: board.name,
            slug: board.name.toLowerCase().replace(/ /g, "-"),
            organizationId: orgId,
            creatorId: z.userID,
            createdAt: now,
          });

          for (let column of board.columns) {
            const columnId = createId();

            await m.columnsTable.insert({
              id: columnId,
              boardId,
              createdAt: now,
              name: column.name,
              position: column.position,
              creatorId: z.userID,
              organizationId: orgId,
            });

            for (let task of column.tasks) {
              await m.tasksTable.insert({
                id: createId(),
                name: task.name,
                createdAt: now,
                position: task.position,
                columnId,
                creatorId: z.userID,
                organizationId: orgId,
              });
            }
          }
        }
      }),
    );

    if (error) {
      toast.error("Error importing boards");
      return;
    }

    toast.success("Boards imported successfully");
    onClose();
  };

  const getJsonFromFile = async (
    file: File,
  ): Promise<AllBoardsQueryResult | undefined> => {
    try {
      const data = await file.text();
      const json = JSON.parse(data);
      return json;
    } catch (error) {
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("json-file") as File;
    const jsonInput = formData.get("json-input") as string;

    if (!file.name && !jsonInput) {
      toast.error("Please provide either a JSON file or paste JSON data");
      return;
    }

    if (file.name && jsonInput) {
      toast.error("Please only provide one of the options, not both.");
      return;
    }

    if (file.name) {
      const json = await getJsonFromFile(file);

      if (!json) {
        toast.error("Invalid JSON file");
        return;
      }

      await handleImport(json);
    }

    if (jsonInput) {
      try {
        const json = JSON.parse(jsonInput);
        await handleImport(json);
      } catch (error) {
        toast.error("Invalid JSON data");
        return;
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl! flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 relative">
            <Textarea
              name="json-input"
              placeholder="Paste JSON data here"
              className="h-[300px]"
            />

            <p className="text-sm text-muted-foreground text-center">Or</p>

            <div className="grid gap-1.5">
              <Label htmlFor="import-file" className="text-xs">
                Choose a JSON file to import
              </Label>
              <Input
                type="file"
                id="import-file"
                placeholder="Import data from JSON file"
                name="json-file"
              />
            </div>

            <Button type="submit" className="w-full">
              {<ImportIcon className="w-4 h-4" />}
              Import
            </Button>

            <p className="text-sm text-muted-foreground text-left flex items-center gap-1">
              <InfoIcon className="w-4 h-4 self-start mt-1 shrink-0" />
              Please note that you will be the creator of the imported boards
              not the original creator of the boards that you are importing.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
