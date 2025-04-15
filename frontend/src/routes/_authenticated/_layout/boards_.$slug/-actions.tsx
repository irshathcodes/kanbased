import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { TaskDetail } from "@/features/board-detail/components/task-detail";
import { QueryKey } from "@tanstack/react-query";

const routeApi = getRouteApi("/_authenticated/_layout/boards_/$boardUrl");

export function TaskDetailPage(props: { columnsQueryKey: QueryKey }) {
  const router = useRouter();
  const { taskId } = routeApi.useSearch();

  if (!taskId) {
    return null;
  }

  const handleClose = () => {
    router.navigate({
      to: ".",
      search: { taskId: undefined },
      replace: true,
    });

    setTimeout(() => {
      const el = document.querySelector(
        `#task-${taskId}`,
      ) as HTMLElement | null;
      el?.focus();
    }, 100);
  };

  return (
    <TaskDetail
      onClose={handleClose}
      taskId={taskId}
      columnsQueryKey={props.columnsQueryKey}
    />
  );
}
