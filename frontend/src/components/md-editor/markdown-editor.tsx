import {useEffect, useImperativeHandle} from "react";
import {
  Milkdown,
  MilkdownProvider,
  useEditor,
  useInstance,
} from "@milkdown/react";
import {editorViewCtx} from "@milkdown/kit/core";
import type {RefObject} from "react";
import type {ListenerManager} from "@milkdown/kit/plugin/listener";
import {Crepe} from "@/features/soja-editor";
import {useAppContext} from "@/state/app-state";

import "../../features/soja-editor/theme/common/style.css";
import "../../features/soja-editor/theme/frame/style.css";
import {getMarkdown} from "@milkdown/kit/utils";
import {placeholderConfig} from "@/features/soja-editor/feature/placeholder";

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
  const {defaultValue = ""} = props;
  const {theme} = useAppContext();
  const placeholder = props.defaultReadOnly ? "" : props.placeholder;

  const focusEditor = () => {
    const editorInstance = editor.get();
    if (editorInstance && editorInstance.ctx) {
      const view = editorInstance.ctx.get(editorViewCtx);
      if (
        view &&
        view.state &&
        view.state.doc &&
        view.state.selection &&
        typeof (view.state.selection.constructor as any).atEnd === "function"
      ) {
        const {state} = view;
        // Access Selection.atEnd via the constructor of the current selection instance
        const selectionConstructor = state.selection.constructor as any;
        const selectionAtEnd = selectionConstructor.atEnd(state.doc);
        const tr = state.tr.setSelection(selectionAtEnd);
        view.dispatch(tr);
        view.focus(); // Ensure the editor has DOM focus
      } else if (view) {
        // Fallback: if the above conditions are not met, just focus the editor
        view.focus();
      }
      props.onFocus?.();
    }
  };

  const setPlaceholder = (placeholder: string) => {
    const editorInstance = editor.get();
    if (editorInstance && editorInstance.ctx) {
      editorInstance.ctx.update(placeholderConfig.key, (prev) => {
        return {
          ...prev,
          text: placeholder,
        };
      });
    }
  };

  const updateTheme = (currentTheme: typeof theme) => {
    const milkdownEl = document.querySelector(".milkdown");

    if (currentTheme === "dark") {
      milkdownEl?.classList.add("dark");
    } else if (currentTheme === "light") {
      milkdownEl?.classList.remove("dark");
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      if (mediaQuery.matches) {
        milkdownEl?.classList.add("dark");
      } else {
        milkdownEl?.classList.remove("dark");
      }
    }
  };

  const getMarkdownContent = () => {
    const editorInstance = editor.get();

    if (!editorInstance || !editorInstance.ctx) {
      console.error("Editor instance not found");
      return "";
    }

    return editorInstance.action(getMarkdown());
  };

  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  useEffect(() => {
    setPlaceholder(props.placeholder ?? "");
  }, [props.placeholder]);

  // @ts-expect-error
  const editor = useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue,
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: placeholder,
          mode: "block",
        },
        [Crepe.Feature.BlockEdit]: {
          slashMenuH1Label: "H1",
          slashMenuH2Label: "H2",
          slashMenuH3Label: "H3",
        },
      },
    });

    props.defaultReadOnly && crepe.setReadonly(true);

    crepe.on((api: ListenerManager) => {
      api.markdownUpdated((_, updatedMarkdown) => {
        props.onChange?.(updatedMarkdown);
      });
      api.mounted(() => {
        updateTheme(theme);
        if (props.focusOnMount) {
          focusEditor();
        }
      });
    });

    return crepe;
  }, []);

  useImperativeHandle(props.ref, () => ({
    focus: focusEditor,
    getMarkdown: getMarkdownContent,
  }));

  return <Milkdown />;
}

export default function MarkdownEditor(props: MilkdownEditorProps) {
  return (
    <MilkdownProvider>
      <MilkdownEditorImpl {...props} />
    </MilkdownProvider>
  );
}
