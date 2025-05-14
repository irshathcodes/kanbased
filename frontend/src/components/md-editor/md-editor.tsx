const customTheme = {};

type VimMode = "insert" | "normal" | "visual";
export type EditorMode = "vim" | "standard";

export type CodeMirrorEditorRefData = {};

export type CodeMirrorEditorRef =
  React.RefObject<CodeMirrorEditorRefData | null>;

interface CodeMirrorEditorProps {
  onModeChange: (mode: EditorMode) => void;
  onExitEditorWithoutSaving?: () => void;
  viewStyle?: "zen" | "normal";
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  return null;
}
