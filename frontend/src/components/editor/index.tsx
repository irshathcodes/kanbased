import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  useEditor,
} from "novel";
import {RefObject, useImperativeHandle} from "react";
import {extensions} from "./extensions";
import {ColorSelector} from "./color-selector";
import {LinkSelector} from "./link-selector";
import {MathSelector} from "./math-selector";
import {NodeSelector} from "./node-selector";
import {Separator} from "@/components/ui/separator";

import GenerativeMenuSwitch from "./generative-menu-switch";
import {uploadFn} from "./image-upload";
import {TextButtons} from "./text-buttons";
import {suggestionItems} from "./slash-command";

export type EditorRef = {
  focus: () => void;
  getMarkdown: () => string;
};

type EditorProps = {
  defaultValue?: string;
  placeholder: string;
  focusOnMount?: boolean;
  ref: RefObject<EditorRef | null>;
  onChange?: (markdown: string) => void;
  onFocus?: () => void;
  defaultReadOnly?: boolean;
};

export default function Editor(props: EditorProps) {
  const {editor} = useEditor();

  useImperativeHandle(props.ref, () => ({
    focus: () => {
      editor?.commands.focus("end", {scrollIntoView: true});
    },
    getMarkdown: () => {
      return editor?.storage.markdown.getMarkdown() ?? "";
    },
  }));

  const handleUpdate = async (editor: EditorInstance) => {
    const markdown = editor.storage.markdown.getMarkdown();
    props.onChange?.(markdown);
  };

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        className="relative min-h-[200px] w-full bg-background sm:mb-[calc(20vh)]"
        initialContent={(props.defaultValue as any) ?? undefined}
        autofocus
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
          },
        }}
        onUpdate={({editor}) => handleUpdate(editor)}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <GenerativeMenuSwitch>
          <Separator orientation="vertical" />
          <NodeSelector />
          <Separator orientation="vertical" />

          <LinkSelector />
          <Separator orientation="vertical" />
          <MathSelector />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector />
        </GenerativeMenuSwitch>
      </EditorContent>
    </EditorRoot>
  );
}
