import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { vim, getCM, Vim } from "@replit/codemirror-vim";
import { basicExtensions } from "@/components/md-editor/helpers";
import { indentWithTab } from "@codemirror/commands";

import "./theme.css";
import { themeExtension } from "./theme";
import { cn } from "@/lib/utils";

const customTheme = EditorView.theme({
  "&": {
    fontSize: "16px",
    fontFamily: "'Manrope', system-ui, sans-serif",
    height: "100%",
  },
  ".cm-content": {
    fontFamily: "'Manrope', system-ui, sans-serif",
    padding: "1rem",
    caretColor: "var(--foreground)",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  ".cm-line": {
    padding: "0 4px",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
  ".cm-scroller": {
    fontFamily: "'Manrope', system-ui, sans-serif",
    lineHeight: "1.6",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--gray-a4) !important",
  },
});

type VimMode = "insert" | "normal" | "visual";
export type EditorMode = "vim" | "standard";

export type CodeMirrorEditorRefData = {
  getData: () => string;
  focus: () => void;
  handleEscapeForVim: () => void;
  getVimMode: () => VimMode;
};

export type CodeMirrorEditorRef =
  React.RefObject<CodeMirrorEditorRefData | null>;

interface CodeMirrorEditorProps {
  defaultContent?: string;
  defaultAutoFocus?: boolean;
  defaultMode?: EditorMode;
  ref: CodeMirrorEditorRef;
  onChange?: (value: string) => void;
  onModeChange: (mode: EditorMode) => void;
  onSave: () => void;
  onExitEditorWithoutSaving?: () => void;
  placeholder?: string;
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const initializedRef = useRef(false);
  const [vimMode, setVimMode] = useState<VimMode>("normal");

  useImperativeHandle(props.ref, () => ({
    getData: () => {
      return viewRef.current?.state.doc.toString() || "";
    },
    focus: () => {
      viewRef.current?.focus();
    },
    handleEscapeForVim: () => {
      if (viewRef.current) {
        viewRef.current.focus();
        const cm = getCM(viewRef.current);
        if (cm) {
          Vim.handleKey(cm, "<Esc>");
        }
      }
    },
    getVimMode: () => vimMode,
  }));

  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return;
    initializedRef.current = true;

    const updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        props.onChange?.(newValue);
      }
    });

    const state = EditorState.create({
      doc: props.defaultContent,
      extensions: [
        props.defaultMode === "vim" ? vim() : [],
        basicExtensions({
          placeholder: props.placeholder ?? "Write something...",
        }),
        keymap.of([indentWithTab]),
        customTheme,
        themeExtension(),
        markdown(),
        EditorView.lineWrapping,
        updateListenerExtension,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Set initial cursor position
    view.dispatch({
      selection: {
        anchor: view.state.doc.length,
        head: view.state.doc.length,
      },
    });

    // Set up initial mode
    if (props.defaultMode === "vim") {
      const cm = getCM(view)!;

      cm.on("vim-mode-change", (data: { mode: VimMode }) => {
        setVimMode(data.mode);
      });

      // Put vim in insert mode by default
      setTimeout(() => {
        if (cm) {
          // Switch to insert mode by default
          Vim.handleKey(cm, "i");
        }
      }, 0);

      Vim.defineEx("write", "w", function () {
        props.onSave();
      });

      Vim.defineEx("wq", "wq", function () {
        props.onSave();
      });

      Vim.defineEx("q", "q", function () {
        props.onExitEditorWithoutSaving?.();
      });
    }

    if (props.defaultAutoFocus) {
      view.focus();
    }

    return () => {
      view.destroy();
      initializedRef.current = false;
    };
  }, []);

  // Handle editor mode change
  const handleEditorModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as EditorMode;
    props.onModeChange(newMode);
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-2 right-2 z-10"></div>
      <div ref={editorRef} className="flex-1 h-full min-h-0" />
      <div className="flex justify-between items-center px-1.5 py-1.5 border-t">
        <div
          className={cn(
            `px-3 py-1 text-xs shrink-0 text-muted-foreground bg-muted uppercase font-bold w-fit rounded`,
            props.defaultMode !== "vim" && "invisible",
          )}
        >
          {vimMode} Mode
        </div>

        <div>
          <select
            value={props.defaultMode}
            onChange={handleEditorModeChange}
            className="text-xs px-2 py-1 rounded border border-gray-300 bg-background relative appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-no-repeat bg-[center_right_4px] pr-6"
          >
            <option value="vim">Vim</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>
    </div>
  );
}
