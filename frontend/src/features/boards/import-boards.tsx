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
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ImportIcon, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveOrganizationId } from "@/queries/session";

export function ImportBoards({ onClose }: ImportBoardsModal) {
  const queryClient = useQueryClient();
  const orgId = useActiveOrganizationId();
  const importBoardsMutation = useMutation("post", "/api/v1/boards/import", {
    meta: {
      showToastOnMutationError: false,
    },
    onSuccess: () => {
      toast.success("Boards imported successfully");
      queryClient.invalidateQueries({
        // queryKey: boardsQueryOptions({ orgId }).queryKey,
      });
    },
    onError: () => {
      toast.error("Error importing boards");
    },
  });

  const handleImport = (data: any) => {
    importBoardsMutation.mutate({ body: { boards: data } });
  };

  const getJsonFromFile = async (file: File): Promise<string | undefined> => {
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

    if (!file && !jsonInput) {
      toast.error("Please provide either a JSON file or paste JSON data");
      return;
    }

    if (file && jsonInput) {
      toast.error("Please provide either a JSON file or paste JSON data");
      return;
    }

    if (file) {
      const json = await getJsonFromFile(file);

      if (!json) {
        toast.error("Invalid JSON file");
        return;
      }

      handleImport(json);
    }

    if (jsonInput) {
      handleImport(jsonInput);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>

        {importBoardsMutation.isSuccess ? (
          <div className="flex flex-col gap-4 items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p>Boards imported successfully</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 relative">
              {importBoardsMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              <Textarea name="json-input" placeholder="Paste JSON data here" />

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

              <Button
                type="submit"
                className="w-full"
                disabled={importBoardsMutation.isPending}
              >
                {importBoardsMutation.isPending ? (
                  <Spinner />
                ) : (
                  <ImportIcon className="w-4 h-4" />
                )}
                Import
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
