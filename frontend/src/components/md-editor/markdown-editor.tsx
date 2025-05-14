import {useEffect} from "react";
import {Milkdown, MilkdownProvider, useEditor} from "@milkdown/react";
import {Crepe} from "@/features/soja-editor";
import {useAppContext} from "@/state/app-state";

import "../../features/soja-editor/theme/common/style.css";
import "../../features/soja-editor/theme/frame/style.css";

type MilkdownEditorProps = {
  defaultValue?: string;
};

function MilkdownEditorImpl(props: MilkdownEditorProps) {
  const {defaultValue = ""} = props;
  const {theme} = useAppContext();

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

  useEffect(() => {
    updateTheme(theme);
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

    crepe.on((api) => {
      api.mounted((ctx) => {
        updateTheme(theme);
      });
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
