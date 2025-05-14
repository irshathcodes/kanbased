import {useBlocker} from "@tanstack/react-router";

export function useDirtyEditorBlock(hasChanges: boolean) {
  useBlocker({
    shouldBlockFn: () => {
      if (!hasChanges) return false;

      const shouldLeave = confirm(
        "There are unsaved changes. Are you sure you want to leave?",
      );

      return !shouldLeave;
    },
    enableBeforeUnload: hasChanges,
  });
}
