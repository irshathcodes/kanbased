import { useRef, useCallback, useInsertionEffect } from "react";

// Approximation of React's upcoming useEffectEvent hook
// This gives us a non-reactive effect event callback, it will always use the latest version of
// the callback, rather than the one that was closed over.
export function useEffectEvent<T extends (...args: any[]) => any>(
  fn: T,
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  const ref = useRef(fn);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    const f = ref.current;
    return f(...args);
  }, []);
}
