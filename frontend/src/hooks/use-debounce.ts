import {useEffect, useRef} from "react";

export default function useDebounce(
  callback: () => void,
  delay: number,
  deps: React.DependencyList,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  });

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      cbRef.current();
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
