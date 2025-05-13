const customTheme = {};

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
  viewStyle?: "zen" | "normal";
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  return null;
}
