import {Icon} from "@milkdown/kit/component";
import {defineComponent, ref, h, Fragment} from "vue";

import type {Icon as IconType} from "../../shared";

export interface BlockHandleProps {
  onAdd: () => void;
  addIcon: IconType;
  handleIcon: IconType;
}

export const BlockHandle = defineComponent<BlockHandleProps>({
  props: {
    onAdd: {
      type: Function,
      required: true,
    },
    addIcon: {
      type: Function,
      required: true,
    },
    handleIcon: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const addButton = ref<HTMLDivElement>();

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addButton.value?.classList.add("active");
    };

    const onPointerUp = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addButton.value?.classList.remove("active");
      props.onAdd();
    };

    return () =>
      h(Fragment, null, [
        h(
          "div",
          {
            ref: addButton,
            class: "operation-item",
            onPointerdown: onPointerDown,
            onPointerup: onPointerUp,
          },
          [h(Icon, {icon: props.addIcon()})],
        ),
        h("div", {class: "operation-item"}, [
          h(Icon, {icon: props.handleIcon()}),
        ]),
      ]);
  },
});
