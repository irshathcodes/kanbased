import {useState} from "react";
import {ArrowRight, Mail, TriangleAlert, X} from "lucide-react";
import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useLocalStorage} from "@/hooks/use-local-storage";

const CONTACT_EMAIL = "irshath700@gmail.com";

// Bump this key whenever the message changes so the banner re-appears
// for users who previously chose to permanently hide an older notice.
const HIDE_FOREVER_KEY = "shutdown-notice-hidden-forever-v1";

export function ShutdownBanner() {
  // Permanent opt-out: persisted, so it never shows again on any page load.
  const [hiddenForever, setHiddenForever] = useLocalStorage(
    HIDE_FOREVER_KEY,
    false,
  );
  // Temporary dismiss: in-memory only, so the banner reappears on every
  // full page load until the user opts out permanently.
  const [dismissed, setDismissed] = useState(false);

  if (hiddenForever || dismissed) return null;

  return (
    <div
      role="alert"
      className={cn(
        "relative border-b border-amber-500/30 bg-amber-50 text-amber-900",
        "dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-100",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-3 pr-12 sm:px-6">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

        <div className="flex flex-col gap-2 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">
              KanBased is winding down soon.
            </span>{" "}
            Unfortunately I can no longer cover the running costs of the
            infrastructure on my own, so I'm planning to shut the project down.
            Please{" "}
            <span className="font-semibold">
              back up your data and migrate away as soon as you can
            </span>{" "}
            to avoid losing anything.
          </p>

          <p className="text-amber-800/90 dark:text-amber-200/90">
            You can download everything from the{" "}
            <span className="font-medium">Boards</span> page using the{" "}
            <span className="font-medium">“⋯” menu → “Export data as JSON”</span>
            .
          </p>

          <p className="text-amber-800/90 dark:text-amber-200/90">
            If KanBased is valuable to you and you'd like to help keep it alive —
            or just want to reach out — please email me at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=KanBased%20support`}
              className="font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-50"
            >
              {CONTACT_EMAIL}
            </a>
            . Without support I'll have to shut things down and sell the server.
            Thank you for using KanBased. 🙏
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              <Link to="/boards">
                Go to Boards to export
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-amber-500/40 bg-transparent text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/40"
            >
              <a href={`mailto:${CONTACT_EMAIL}?subject=KanBased%20support`}>
                <Mail className="h-4 w-4" />
                Email me
              </a>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setHiddenForever(true)}
              className="text-amber-800/80 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-200/80 dark:hover:bg-amber-900/40 dark:hover:text-amber-50"
            >
              Don't show this again
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice for now"
        title="Dismiss for now"
        className={cn(
          "absolute right-3 top-3 rounded-md p-1 transition-colors",
          "text-amber-700 hover:bg-amber-100 hover:text-amber-900",
          "dark:text-amber-300 dark:hover:bg-amber-900/50 dark:hover:text-amber-50",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
