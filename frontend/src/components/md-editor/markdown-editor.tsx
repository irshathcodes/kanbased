import {useEffect, useImperativeHandle, useRef} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Markdown} from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import type {RefObject} from "react";
import {useAppContext} from "@/state/app-state";

export type MilkdownEditorRef = {
  focus: () => void;
  getMarkdown: () => string;
};

type MilkdownEditorProps = {
  defaultValue?: string;
  placeholder: string;
  focusOnMount?: boolean;
  ref: RefObject<MilkdownEditorRef | null>;
  onChange?: (markdown: string) => void;
  onFocus?: () => void;
  defaultReadOnly?: boolean;
};

function MilkdownEditorImpl(props: MilkdownEditorProps) {
  const {
    defaultValue = "",
    placeholder,
    focusOnMount,
    onChange,
    onFocus,
    defaultReadOnly,
  } = props;
  const {theme} = useAppContext();
  const editorRef = useRef<HTMLDivElement>(null);

  // Determine placeholder text based on readonly mode
  const effectivePlaceholder = defaultReadOnly ? "" : placeholder;

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert md:prose-lg lg:prose-xl focus:outline-none font-sans font-medium",
      },
    },
    extensions: [
      StarterKit.configure({
        // Configure heading levels similar to Milkdown setup
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Markdown.configure({
        // Enable GitHub Flavored Markdown
        markedOptions: {
          gfm: true,
        },
      }),
      Placeholder.configure({
        placeholder: effectivePlaceholder,
      }),
    ],
    content: defaultValue,
    contentType: "markdown",
    editable: !defaultReadOnly,
    immediatelyRender: true,
    autofocus: focusOnMount ? "end" : false,
    injectCSS: false,
    onUpdate: ({editor}) => {
      // Get markdown content and call onChange callback
      const markdown = editor.getMarkdown();
      onChange?.(markdown);
    },
    onFocus: () => {
      onFocus?.();
    },
  });

  // Update theme when it changes
  useEffect(() => {
    if (!editorRef.current) return;

    const editorElement = editorRef.current.querySelector(".tiptap");
    if (!editorElement) return;

    if (theme === "dark") {
      editorElement.classList.add("dark");
    } else if (theme === "light") {
      editorElement.classList.remove("dark");
    } else {
      // System theme
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        editorElement.classList.add("dark");
      } else {
        editorElement.classList.remove("dark");
      }
    }
  }, [theme]);

  // Expose ref methods
  useImperativeHandle(props.ref, () => ({
    focus: () => {
      if (editor) {
        editor.commands.focus("end");
        onFocus?.();
      }
    },
    getMarkdown: () => {
      if (!editor) {
        console.error("Editor instance not found");
        return "";
      }
      return editor.getMarkdown();
    },
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div ref={editorRef} className="tiptap-editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
}

export default function MarkdownEditor(props: MilkdownEditorProps) {
  return <MilkdownEditorImpl {...props} />;
}
