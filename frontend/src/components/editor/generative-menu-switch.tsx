import {EditorBubble, removeAIHighlight, useEditor} from "novel";
import {Fragment, type ReactNode, useEffect, useState} from "react";
import {Button} from "../ui/button";
import Magic from "@/components/ui/magic";
import {AISelector} from "./ai-selector";

interface GenerativeMenuSwitchProps {
  children: ReactNode;
}
const GenerativeMenuSwitch = ({children}: GenerativeMenuSwitchProps) => {
  const [openAISelector, setOpenAISelector] = useState(false);
  const {editor} = useEditor();

  useEffect(() => {
    if (!openAISelector) removeAIHighlight(editor!);
  }, [openAISelector]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: openAISelector ? "bottom-start" : "top",
        onHidden: () => {
          setOpenAISelector(false);
          editor!.chain().unsetHighlight().run();
        },
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      {openAISelector && (
        <AISelector open={openAISelector} onOpenChange={setOpenAISelector} />
      )}
      {!openAISelector && (
        <Fragment>
          <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => setOpenAISelector(true)}
            size="sm"
          >
            <Magic className="h-5 w-5" />
            Ask AI
          </Button>
          {children}
        </Fragment>
      )}
    </EditorBubble>
  );
};

export default GenerativeMenuSwitch;
