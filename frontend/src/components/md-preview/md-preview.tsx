import { cn } from "@/lib/utils";

export default function MdPreview(props: {
  html: string;
  wrapperClassName?: string;
}) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 min-h-0">
      <div
        className={cn(
          "prose dark:prose-invert h-full max-w-none",
          props.wrapperClassName,
        )}
        dangerouslySetInnerHTML={{ __html: props.html }}
      ></div>
    </div>
  );
}
