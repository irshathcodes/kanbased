import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { Button } from "@/components/ui/button";
import { useInteractiveOutside } from "@/hooks/use-interactive-outside";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function EditableText({
  fieldName,
  inputClassName,
  inputLabel,
  buttonClassName,
  defaultValue,
  defaultMode = "view",
  onSubmit,
}: {
  fieldName: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName?: string;
  defaultMode?: "edit" | "view";
  defaultValue: string;
  onSubmit: (value: string) => Promise<void> | void;
}) {
  let [edit, setEdit] = useState(defaultMode === "edit");
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (defaultMode === "edit") {
      inputRef.current?.select();
    }
  }, []);

  useInteractiveOutside(formRef, () => {
    setEdit(false);
  });

  return edit ? (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(inputRef.current?.value ?? "");
        flushSync(() => {
          setEdit(false);
        });
        defaultMode !== "edit" && buttonRef.current?.focus();
      }}
      className="flex gap-3 w-full"
      ref={formRef}
    >
      <div className="flex-1">
        <input
          required
          ref={inputRef}
          type="text"
          defaultValue={defaultValue}
          aria-label={inputLabel}
          name={fieldName}
          className={cn("w-full p-2 rounded-lg bg-muted", inputClassName)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              flushSync(() => {
                setEdit(false);
              });
              buttonRef.current?.focus();
            }

            if (event.key === "e") {
              event.stopPropagation();
            }
          }}
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="icon"
          type="button"
          variant="outline"
          className="hover:border-destructive hover:text-destructive hover:bg-red-100"
          onClick={() => setEdit(false)}
        >
          <XIcon className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          type="submit"
          variant="outline"
          className="hover:border-green-500 hover:text-green-500 hover:bg-green-500/10"
        >
          <CheckIcon className="w-4 h-4" />
        </Button>
      </div>
    </form>
  ) : (
    <button
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
      {defaultValue}
    </button>
  );
}
