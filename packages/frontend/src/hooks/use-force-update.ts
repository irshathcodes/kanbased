import { useState } from "react";
import { flushSync } from "react-dom";

/**
 * The main reason for creating this hook is because tanstack query doesn't work
 * well with flushSync. To avoid Optimistic UI flickering, we need to use flushSync.
 */
export function useForceUpdate() {
  const [_, setForceRender] = useState(false);

  const forceUpdate = () => {
    flushSync(() => {
      setForceRender((prev) => !prev);
    });
  };

  return forceUpdate;
}
