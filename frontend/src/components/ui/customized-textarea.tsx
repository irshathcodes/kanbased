import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useCallback } from "react";

export const CustomizedTextarea = ({
  ref,
  ...props
}: React.ComponentProps<"textarea"> & {
  ref: React.Ref<HTMLTextAreaElement | null>;
}) => {
  const onHeightChange = (input: HTMLTextAreaElement) => {
    let prevAlignment = input.style.alignSelf;
    let prevOverflow = input.style.overflow;
    // Firefox scroll position is lost when overflow: 'hidden' is applied so we skip applying it.
    // The measure/applied height is also incorrect/reset if we turn on and off
    // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
    let isFirefox = "MozAppearance" in input.style;
    if (!isFirefox) {
      input.style.overflow = "hidden";
    }
    input.style.alignSelf = "start";
    input.style.height = "auto";
    // offsetHeight - clientHeight accounts for the border/padding.
    input.style.height = `${
      input.scrollHeight + (input.offsetHeight - input.clientHeight)
    }px`;
    input.style.overflow = prevOverflow;
    input.style.alignSelf = prevAlignment;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      const textarea = event.currentTarget;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const value = textarea.value;

      // Insert newline at cursor position
      textarea.value =
        value.substring(0, selectionStart) +
        "\n" +
        value.substring(selectionEnd);

      // Move cursor position after the inserted newline
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;

      onHeightChange(textarea);
      textarea.scrollIntoView({
        block: "nearest",
      });
    }

    props.onKeyDown?.(event);
  };

  return (
    <Textarea
      ref={useCallback((node: HTMLTextAreaElement | null) => {
        if (ref) {
          typeof ref === "function" ? ref(node) : (ref.current = node);
        }

        if (node) {
          onHeightChange(node);
        }
      }, [])}
      {...props}
      onKeyDown={handleKeyDown}
      onChange={(e) => {
        onHeightChange(e.currentTarget);
        props.onChange?.(e);
      }}
    />
  );
};
