import React from "react";
import {Milkdown, MilkdownProvider, useEditor} from "@milkdown/react";
import {Crepe} from "@/features/soja-editor";
import {useAppContext} from "@/state/app-state";

import "../../features/soja-editor/theme/common/style.css";

type MilkdownEditorProps = {
  defaultValue?: string;
};

function MilkdownEditorImpl(props: MilkdownEditorProps) {
  const {defaultValue = ""} = props;
  const {theme} = useAppContext();

  // Dynamically import theme CSS
  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const themePath = isDark
      ? "../../features/soja-editor/theme/frame-dark/style.css"
      : "../../features/soja-editor/theme/frame/style.css";

    import(themePath);
  }, [theme]);

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
