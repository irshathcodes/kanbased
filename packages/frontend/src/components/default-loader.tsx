import { Spinner } from "@/components/ui/spinner";

export function DefaultPendingComponent() {
  return (
    <div className="grid place-content-center w-full mt-8">
      <Spinner size="lg" />
    </div>
  );
}
