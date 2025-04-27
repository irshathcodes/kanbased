import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExportBoardsModal } from "@/features/boards/board.state";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { useQuery } from "@rocicorp/zero/react";
import { useZ } from "@/lib/zero-cache";
import { allBoardsQuery } from "@/lib/zero-queries";

export function ExportBoards({ onClose }: ExportBoardsModal) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl! flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>

        <Suspense fallback={<div>Fetching boards and their data...</div>}>
          <Content />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

function Content() {
  const z = useZ();
  const [boards] = useQuery(allBoardsQuery(z));

  if (!boards.length) {
    return <div>No boards found</div>;
  }

  const data = JSON.stringify(boards, null, 2);

  const handleCopy = (jsonData: string) => {
    navigator.clipboard
      .writeText(jsonData)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleDownload = (jsonData: string) => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full">
      <div>
        <Button
          size="sm"
          variant="outline"
          className="absolute right-4 top-4"
          onClick={() => handleCopy(data)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="absolute right-28 top-4"
          onClick={() => handleDownload(data)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[60vh] text-sm break-all w-full">
        {data}
      </pre>
    </div>
  );
}
