import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValueWithLocalStorage = (value: T | ((prev: T) => T)) => {
    setValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValueWithLocalStorage] as const;
}
