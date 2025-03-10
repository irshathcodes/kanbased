import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { vim, getCM, Vim } from "@replit/codemirror-vim";
import { basicExtensions } from "@/components/md-editor/helpers";
import { indentWithTab } from "@codemirror/commands";

import "./theme.css";
import { themeExtension } from "./theme";

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
type EditorMode = "vim" | "standard";

export type CodeMirrorEditorRefData = {
  getData: () => string;
  focus: () => void;
  handleEscapeForVim: () => void;
  getVimMode: () => VimMode;
};

export type CodeMirrorEditorRef =
  React.RefObject<CodeMirrorEditorRefData | null>;

interface CodeMirrorEditorProps {
  onChange?: (value: string) => void;
  defaultContent?: string;
  defaultAutoFocus?: boolean;
  ref: CodeMirrorEditorRef;
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
        vim(),
        basicExtensions,
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

    // Set up initial mode
    const cm = getCM(view)!;

    cm.on("vim-mode-change", (data: { mode: VimMode }) => {
      setVimMode(data.mode);
    });

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
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-2 right-2 z-10">
        <select
          value={""}
          onChange={handleEditorModeChange}
          className="text-xs px-2 py-1 rounded border border-gray-300 bg-background"
        >
          <option value="vim">Vim Mode</option>
          <option value="standard">Standard Mode</option>
        </select>
      </div>
      <div ref={editorRef} className="flex-1 h-full min-h-0" />
      <div
        className={`px-3 py-1 text-xs shrink-0 text-muted-foreground bg-muted uppercase font-bold w-fit rounded`}
      >
        {vimMode} Mode
      </div>
    </div>
  );
}
