import {useHotkeys} from "react-hotkeys-hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useAppContext} from "@/state/app-state";
import {isMac, ModKey} from "@/lib/constants";

type ShortcutItem = {
  keys: string[];
  description: string;
  condition?: string;
};

type ShortcutCategory = {
  title: string;
  shortcuts: ShortcutItem[];
};

const SHORTCUTS: ShortcutCategory[] = [
  {
    title: "Global",
    shortcuts: [
      {
        keys: [ModKey, "K"],
        description: "Open command palette",
      },
      {
        keys: [ModKey, "O"],
        description: "Switch workspace",
      },
      {
        keys: [ModKey, "B"],
        description: "Toggle sidebar",
      },
      {
        keys: [ModKey, "Z"],
        description: "Undo last action",
      },
      {
        keys: [ModKey, "shift", "H"],
        description: "Show keyboard shortcuts",
      },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      {
        keys: ["j", "↓"],
        description: "Move focus down",
      },
      {
        keys: ["k", "↑"],
        description: "Move focus up",
      },
      {
        keys: ["h", "←"],
        description: "Move focus left / previous column",
      },
      {
        keys: ["l", "→"],
        description: "Move focus right / next column",
      },
      {
        keys: ["g"],
        description: "Move to first item",
      },
      {
        keys: ["G"],
        description: "Move to last item",
      },
    ],
  },
  {
    title: "Boards",
    shortcuts: [
      {
        keys: ["a"],
        description: "Create new board",
        condition: "On boards page",
      },
    ],
  },
  {
    title: "Tasks",
    shortcuts: [
      {
        keys: ["t"],
        description: "Add task at end of column",
        condition: "Only when the task is focused",
      },
      {
        keys: ["T"],
        description: "Add task at start of column",
        condition: "Only when the task is focused",
      },
      {
        keys: ["i"],
        description: "Edit task",
        condition: "Only when the task is focused",
      },
      {
        keys: ["Shift", "D"],
        description: "Delete task",
        condition: "Only when the task is focused",
      },
      {
        keys: ["a"],
        description: "Assign task",
        condition: "Only when the task is focused",
      },
      {
        keys: ["f"],
        description: "Focus task editor",
        condition: "only when the task detail open",
      },
      {
        keys: [ModKey, "S"],
        description: "Save task",
        condition: "only when the task detail open",
      },
      {
        keys: [ModKey, "Z"],
        description: "Undo deleted task",
        condition:
          "Only if there are any tasks deleted during the current session",
      },
    ],
  },
  {
    title: "Notes",
    shortcuts: [
      {
        keys: ["a"],
        description: "Create new note",
        condition: "On notes page",
      },
      {
        keys: ["f"],
        description: "Focus note editor",
        condition: "Note dialog open",
      },
      {
        keys: [ModKey, "S"],
        description: "Save note",
        condition: "Note dialog open",
      },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      {
        keys: ["Enter"],
        description: "Save",
        condition: "Text input focused",
      },
      {
        keys: ["Shift", "Enter"],
        description: "New line",
        condition: "Textarea focused",
      },
      {
        keys: ["Esc"],
        description: "Cancel / Close",
      },
    ],
  },
];

function KeyboardShortcut({keys}: {keys: string[]}) {
  return (
    <div className="flex gap-1 items-center shrink-0">
      {keys.map((key, index) => (
        <span key={index} className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-base font-medium text-muted-foreground opacity-100">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function KeyboardShortcutsDialog() {
  const {isHelpOpen, openHelp, closeHelp} = useAppContext();

  useHotkeys(
    "mod+shift+h",
    () => {
      openHelp();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  );

  return (
    <Dialog open={isHelpOpen} onOpenChange={closeHelp}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Navigate and control Kanbased with your keyboard
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {SHORTCUTS.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 py-2 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-foreground">
                        {shortcut.description}
                      </p>
                      {shortcut.condition && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {shortcut.condition}
                        </p>
                      )}
                    </div>
                    <KeyboardShortcut keys={shortcut.keys} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">{isMac ? "⌘" : "Ctrl"}</span> = Cmd
            on Mac, Ctrl on Windows/Linux
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Some shortcuts are only available when not in readonly mode (member
            role)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
