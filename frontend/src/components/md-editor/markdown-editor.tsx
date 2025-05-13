import {Milkdown, MilkdownProvider, useEditor} from "@milkdown/react";
import {Crepe} from "@/features/soja-editor";

import "../../features/soja-editor/theme/common/style.css";
import "../../features/soja-editor/theme/frame/style.css";

type MilkdownEditorProps = {
  defaultValue?: string;
};

function MilkdownEditorImpl(props: MilkdownEditorProps) {
  const {defaultValue = ""} = props;
  // @ts-expect-error
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue,
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: "Write something...",
          mode: "doc",
        },
      },
    });

    return crepe;
  }, []);

  return <Milkdown />;
}

export default function MarkdownEditor(props: MilkdownEditorProps) {
  return (
    <MilkdownProvider>
      <MilkdownEditorImpl {...props} />
    </MilkdownProvider>
  );
}
