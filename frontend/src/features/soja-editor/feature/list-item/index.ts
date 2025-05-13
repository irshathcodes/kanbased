import {
  listItemBlockComponent,
  listItemBlockConfig,
} from "@milkdown/kit/component/list-item-block";
import {
  bulletIcon,
  checkBoxCheckedIcon,
  checkBoxUncheckedIcon,
} from "../../icons";
import type {Ctx} from "@milkdown/kit/ctx";


import type {DefineFeature, Icon} from "../shared";


export interface ListItemConfig {
  bulletIcon: Icon;
  checkBoxCheckedIcon: Icon;
  checkBoxUncheckedIcon: Icon;
}

export type ListItemFeatureConfig = Partial<ListItemConfig>;

function configureListItem(ctx: Ctx, config?: ListItemFeatureConfig) {
  ctx.set(listItemBlockConfig.key, {
    renderLabel: ({label, listType, checked}) => {
      if (checked == null) {
        if (listType === "bullet") return config?.bulletIcon?.() ?? bulletIcon;

        return label;
      }

      if (checked)
        return config?.checkBoxCheckedIcon?.() ?? checkBoxCheckedIcon;

      return config?.checkBoxUncheckedIcon?.() ?? checkBoxUncheckedIcon;
    },
  });
}

export const defineFeature: DefineFeature<ListItemFeatureConfig> = (
  editor,
  config,
) => {
  editor
    .config((ctx) => configureListItem(ctx, config))
    .use(listItemBlockComponent);
};
