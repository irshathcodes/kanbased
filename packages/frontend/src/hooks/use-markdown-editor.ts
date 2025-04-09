import {
  CodeMirrorEditorRef,
  EditorMode,
} from "@/components/md-editor/md-editor";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { markdownToHtml } from "@/lib/helpers";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useState } from "react";

type Mode = "write" | "preview";

export function useMarkdownEditorPreviewToggle({
  defaultContent = "",
  editorRef,
  isDirty,
}: {
  defaultContent: string;
  editorRef: CodeMirrorEditorRef;
  isDirty: boolean;
}) {
  const [parsedHtml, setParsedHtml] = useState(() =>
    markdownToHtml(defaultContent),
  );
  const [mode, setMode] = useState<Mode>("write");
  const [editorMode, setEditorMode] = useLocalStorage<EditorMode>(
    "preferred-editor-mode",
    "standard",
  );
  const toggleModeKey = "M";

  const getMarkdown = () => {
    return editorRef.current?.getData() ?? "";
  };

  const updateMarkdownToHtml = () => {
    const markdown = getMarkdown();
    const html = markdownToHtml(markdown);
    setParsedHtml(html);
  };

  const focusEditor = () => {
    setTimeout(() => {
      editorRef.current?.focus();
    }, 100);
  };

  const handleModeChange = (value: Mode) => {
    setMode(value);

    if (value === "write") {
      focusEditor();
    } else if (value === "preview") {
      updateMarkdownToHtml();
    }
  };

  const toggleMode = () => {
    let newMode: Mode = "write";

    setMode((prev) => {
      newMode = prev === "write" ? "preview" : "write";
      return newMode;
    });

    if (newMode === "write") {
      focusEditor();
    } else if (newMode === "preview") {
      updateMarkdownToHtml();
    }
  };

  const hasChanges = () => {
    return !!isDirty;
  };

  useBlocker({
    shouldBlockFn: () => {
      if (!hasChanges()) return false;

      const shouldLeave = confirm(
        "There are unsaved changes. Are you sure you want to leave?",
      );
      return !shouldLeave;
    },
    enableBeforeUnload: hasChanges,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === toggleModeKey.toLowerCase()) {
        e.preventDefault();
        toggleMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    parsedHtml,
    mode,
    handleModeChange,
    editorMode,
    toggleModeKey,
    setEditorMode,
  };
}
