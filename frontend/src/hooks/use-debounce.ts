import {useEffect, useEffectEvent, useRef} from "react";

export default function useDebounce<T>(
  callback: () => void,
  delay: number,
  deps: React.DependencyList,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useEffectEvent(callback);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      cb();
      timeout.current = null;
    }, delay);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, [...deps, delay]);
}
