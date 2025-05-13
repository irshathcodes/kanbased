import type {Editor} from "@milkdown/kit/core";

import type {CursorFeatureConfig} from "./cursor";
import type {ImageBlockFeatureConfig} from "./image-block";
import type {LinkTooltipFeatureConfig} from "./link-tooltip";
import type {ListItemFeatureConfig} from "./list-item";
import type {PlaceHolderFeatureConfig} from "./placeholder";
import type {TableFeatureConfig} from "./table";

export enum CrepeFeature {
  ListItem = "list-item",
  LinkTooltip = "link-tooltip",
  Cursor = "cursor",
  ImageBlock = "image-block",
  Placeholder = "placeholder",
  Table = "table",
}

export interface CrepeFeatureConfig {
  [CrepeFeature.Cursor]?: CursorFeatureConfig;
  [CrepeFeature.ListItem]?: ListItemFeatureConfig;
  [CrepeFeature.LinkTooltip]?: LinkTooltipFeatureConfig;
  [CrepeFeature.ImageBlock]?: ImageBlockFeatureConfig;
  [CrepeFeature.Placeholder]?: PlaceHolderFeatureConfig;
  [CrepeFeature.Table]?: TableFeatureConfig;
}

export const defaultFeatures: Record<CrepeFeature, boolean> = {
  [CrepeFeature.Cursor]: true,
  [CrepeFeature.ListItem]: true,
  [CrepeFeature.LinkTooltip]: true,
  [CrepeFeature.ImageBlock]: true,
  [CrepeFeature.Placeholder]: true,
  [CrepeFeature.Table]: true,
};

export async function loadFeature(
  feature: CrepeFeature,
  editor: Editor,
  config?: never,
) {
  switch (feature) {
    case CrepeFeature.ListItem: {
      const {defineFeature} = await import("./list-item");
      return defineFeature(editor, config);
    }
    case CrepeFeature.LinkTooltip: {
      const {defineFeature} = await import("./link-tooltip");
      return defineFeature(editor, config);
    }
    case CrepeFeature.ImageBlock: {
      const {defineFeature} = await import("./image-block");
      return defineFeature(editor, config);
    }
    case CrepeFeature.Cursor: {
      const {defineFeature} = await import("./cursor");
      return defineFeature(editor, config);
    }
    case CrepeFeature.Placeholder: {
      const {defineFeature} = await import("./placeholder");
      return defineFeature(editor, config);
    }
    case CrepeFeature.Table: {
      const {defineFeature} = await import("./table");
      return defineFeature(editor, config);
    }
  }
}
