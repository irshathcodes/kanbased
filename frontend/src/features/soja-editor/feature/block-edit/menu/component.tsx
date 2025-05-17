import type {Ctx} from "@milkdown/kit/ctx";
import {Icon} from "@milkdown/kit/component";
import {
  computed,
  defineComponent,
  h,
  onUnmounted,
  ref,
  watch,
  watchEffect,
  type Ref,
} from "vue";
import type {BlockEditFeatureConfig} from "..";
import {getGroups} from "./config";

type MenuProps = {
  ctx: Ctx;
  show: Ref<boolean>;
  filter: Ref<string>;
  hide: () => void;
  config?: BlockEditFeatureConfig;
};

export const Menu = defineComponent<MenuProps>({
  props: {
    ctx: Object,
    show: Object,
    filter: Object,
    hide: Function,
    config: Object,
  },
  setup({ctx, show, filter, hide, config}) {
    const host = ref<HTMLElement>();
    const groupInfo = computed(() => getGroups(filter.value, config, ctx));
    const hoverIndex = ref(0);
    const prevMousePosition = ref({x: -999, y: -999});

    const onPointerMove = (e: MouseEvent) => {
      const {x, y} = e;
      prevMousePosition.value = {x, y};
    };

    watch([groupInfo, show], () => {
      const {size} = groupInfo.value;
      if (size === 0 && show.value) hide();
      else if (hoverIndex.value >= size) hoverIndex.value = 0;
    });

    const onHover = (
      index: number | ((prev: number) => number),
      after?: (index: number) => void,
    ) => {
      const prevHoverIndex = hoverIndex.value;
      const next = typeof index === "function" ? index(prevHoverIndex) : index;
      after?.(next);
      hoverIndex.value = next;
    };

    const scrollToIndex = (index: number) => {
      const target = host.value?.querySelector<HTMLElement>(
        `[data-index="${index}"]`,
      );
      const scrollRoot = host.value?.querySelector<HTMLElement>(".menu-groups");
      if (!target || !scrollRoot) return;
      scrollRoot.scrollTop = target.offsetTop - scrollRoot.offsetTop;
    };

    const runByIndex = (index: number) => {
      const item = groupInfo.value.groups
        .flatMap((group) => group.items)
        .at(index);
      if (item && ctx) item.onRun(ctx);
      hide();
    };

    const onKeydown = (e: KeyboardEvent) => {
      const {size, groups} = groupInfo.value;
      if (e.key === "Escape") {
        e.preventDefault();
        hide?.();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        return onHover((i) => (i < size - 1 ? i + 1 : i), scrollToIndex);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        return onHover((i) => (i <= 0 ? i : i - 1), scrollToIndex);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        return onHover((i) => {
          const group = groups.find((g) => g.range[0] <= i && g.range[1] > i);
          const prevGroup = group
            ? groups[groups.indexOf(group) - 1]
            : undefined;
          return prevGroup ? prevGroup.range[1] - 1 : i;
        }, scrollToIndex);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        return onHover((i) => {
          const group = groups.find((g) => g.range[0] <= i && g.range[1] > i);
          const nextGroup = group
            ? groups[groups.indexOf(group) + 1]
            : undefined;
          return nextGroup ? nextGroup.range[0] : i;
        }, scrollToIndex);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        runByIndex(hoverIndex.value);
      }
    };

    const getOnPointerEnter = (index: number) => (e: MouseEvent) => {
      const {x, y} = e;
      if (x === prevMousePosition.value.x && y === prevMousePosition.value.y)
        return;
      onHover(index);
    };

    watchEffect(() => {
      const isShown = show.value;
      const method = isShown ? "addEventListener" : "removeEventListener";
      window[method]("keydown", onKeydown as EventListener, {capture: true});
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", onKeydown, {capture: true});
    });

    return () =>
      h(
        "div",
        {
          ref: host,
          onPointerdown: (e: PointerEvent) => e.preventDefault(),
        },
        [
          h("nav", {class: "tab-group"}, [
            h(
              "ul",
              groupInfo.value.groups.map((group) =>
                h(
                  "li",
                  {
                    key: group.key,
                    onPointerdown: () => onHover(group.range[0], scrollToIndex),
                    class:
                      hoverIndex.value >= group.range[0] &&
                      hoverIndex.value < group.range[1]
                        ? "selected"
                        : "",
                  },
                  group.label,
                ),
              ),
            ),
          ]),
          h(
            "div",
            {
              class: "menu-groups",
              onPointermove: onPointerMove,
            },
            groupInfo.value.groups.map((group) =>
              h("div", {key: group.key, class: "menu-group"}, [
                h("h6", group.label),
                h(
                  "ul",
                  group.items.map((item) =>
                    h(
                      "li",
                      {
                        "key": item.key,
                        "data-index": item.index,
                        "class": hoverIndex.value === item.index ? "hover" : "",
                        "onPointerenter": getOnPointerEnter(item.index),
                        "onPointerdown": () => {
                          host.value
                            ?.querySelector(`[data-index="${item.index}"]`)
                            ?.classList.add("active");
                        },
                        "onPointerup": () => {
                          host.value
                            ?.querySelector(`[data-index="${item.index}"]`)
                            ?.classList.remove("active");
                          runByIndex(item.index);
                        },
                      },
                      [h(Icon, {icon: item.icon}), h("span", item.label)],
                    ),
                  ),
                ),
              ]),
            ),
          ),
        ],
      );
  },
});
