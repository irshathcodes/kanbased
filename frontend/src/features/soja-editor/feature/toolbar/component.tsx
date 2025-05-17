import type {Ctx} from "@milkdown/kit/ctx";
import type {MarkType} from "@milkdown/kit/prose/model";

import {Icon} from "@milkdown/kit/component";
import {linkTooltipAPI} from "@milkdown/kit/component/link-tooltip";
import {commandsCtx, editorViewCtx} from "@milkdown/kit/core";
import {
  emphasisSchema,
  inlineCodeSchema,
  linkSchema,
  strongSchema,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,
} from "@milkdown/kit/preset/commonmark";
import {
  strikethroughSchema,
  toggleStrikethroughCommand,
} from "@milkdown/kit/preset/gfm";
import {type Selection} from "@milkdown/kit/prose/state";
import clsx from "clsx";
import {defineComponent, type Ref, type ShallowRef, h, Fragment} from "vue";

import type {ToolbarFeatureConfig} from ".";
import {
  boldIcon,
  codeIcon,
  italicIcon,
  linkIcon,
  strikethroughIcon,
} from "../../icons";

type ToolbarProps = {
  ctx: Ctx;
  hide: () => void;
  show: Ref<boolean>;
  selection: ShallowRef<Selection>;
  config?: ToolbarFeatureConfig;
};

export const Toolbar = defineComponent<ToolbarProps>({
  props: {
    ctx: Object,
    hide: Function,
    show: Object,
    selection: Object,
    config: Object,
  },
  setup(props) {
    const {ctx, hide, config} = props;

    const onClick = (fn: (ctx: Ctx) => void) => (e: MouseEvent) => {
      e.preventDefault();
      ctx && fn(ctx);
    };

    const isActive = (mark: MarkType) => {
      const selection = props.selection.value;
      if (!ctx || !selection) return false;
      const {state} = ctx.get(editorViewCtx);
      return (
        state?.doc.rangeHasMark(selection.from, selection.to, mark) ?? false
      );
    };

    return () =>
      h(Fragment, null, [
        h(
          "button",
          {
            type: "button",
            class: clsx(
              "toolbar-item",
              ctx && isActive(strongSchema.type(ctx)) && "active",
            ),
            onPointerdown: onClick((ctx) => {
              ctx.get(commandsCtx).call(toggleStrongCommand.key);
            }),
          },
          [h(Icon, {icon: config?.boldIcon?.() ?? boldIcon})],
        ),
        h(
          "button",
          {
            type: "button",
            class: clsx(
              "toolbar-item",
              ctx && isActive(emphasisSchema.type(ctx)) && "active",
            ),
            onPointerdown: onClick((ctx) => {
              ctx.get(commandsCtx).call(toggleEmphasisCommand.key);
            }),
          },
          [h(Icon, {icon: config?.italicIcon?.() ?? italicIcon})],
        ),
        h(
          "button",
          {
            type: "button",
            class: clsx(
              "toolbar-item",
              ctx && isActive(strikethroughSchema.type(ctx)) && "active",
            ),
            onPointerdown: onClick((ctx) => {
              ctx.get(commandsCtx).call(toggleStrikethroughCommand.key);
            }),
          },
          [h(Icon, {icon: config?.strikethroughIcon?.() ?? strikethroughIcon})],
        ),
        h("div", {class: "divider"}),
        h(
          "button",
          {
            type: "button",
            class: clsx(
              "toolbar-item",
              ctx && isActive(inlineCodeSchema.type(ctx)) && "active",
            ),
            onPointerdown: onClick((ctx) => {
              ctx.get(commandsCtx).call(toggleInlineCodeCommand.key);
            }),
          },
          [h(Icon, {icon: config?.codeIcon?.() ?? codeIcon})],
        ),
        h(
          "button",
          {
            type: "button",
            class: clsx(
              "toolbar-item",
              ctx && isActive(linkSchema.type(ctx)) && "active",
            ),
            onPointerdown: onClick((ctx) => {
              const view = ctx.get(editorViewCtx);
              const {selection} = view.state;

              if (isActive(linkSchema.type(ctx))) {
                ctx
                  .get(linkTooltipAPI.key)
                  .removeLink(selection.from, selection.to);
              } else {
                ctx
                  .get(linkTooltipAPI.key)
                  .addLink(selection.from, selection.to);
                hide?.();
              }
            }),
          },
          [h(Icon, {icon: config?.linkIcon?.() ?? linkIcon})],
        ),
      ]);
  },
});
