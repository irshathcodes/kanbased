import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function EditableText({
  children,
  fieldName,
  value,
  inputClassName,
  inputLabel,
  buttonClassName,
  buttonLabel,
  onSubmit,
  defaultEdit = false,
}: {
  children?: React.ReactNode;
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
  onSubmit: (value: string) => Promise<void> | void;
  defaultEdit?: boolean;
}) {
  let [edit, setEdit] = useState(defaultEdit);
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (defaultEdit) {
      inputRef.current?.select();
    }
  }, []);

  return edit ? (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(inputRef.current?.value ?? "");
        flushSync(() => {
          setEdit(false);
        });
        buttonRef.current?.focus();
      }}
      onBlur={(e) => {
        if (e.relatedTarget !== e.target) {
          setEdit(false);
        }
      }}
    >
      {children}
      <input
        required
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        name={fieldName}
        defaultValue={value}
        className={cn("w-full p-2 rounded-lg bg-muted", inputClassName)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            flushSync(() => {
              setEdit(false);
            });
            buttonRef.current?.focus();
          }
        }}
      />
    </form>
  ) : (
    <button
      aria-label={buttonLabel}
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
      className={cn("w-full text-left p-2 rounded-lg", buttonClassName)}
    >
      {value}
    </button>
  );
}
