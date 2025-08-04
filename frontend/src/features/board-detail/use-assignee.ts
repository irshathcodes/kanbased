import {useState} from "react";
import {useZ} from "@/lib/zero-cache";

export function useAssignee(data: {taskId: string}) {
  const z = useZ();
  const [assigneeComboboxOpen, _setAssigneeComboboxOpen] = useState(false);

  const setAssigneeComboboxOpen = (open: boolean) => {
    _setAssigneeComboboxOpen(open);
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    z.mutate.tasksTable.update({
      id: data.taskId,
      assigneeId,
      updatedAt: Date.now(),
    });

    setAssigneeComboboxOpen(false);
  };

  return {assigneeComboboxOpen, setAssigneeComboboxOpen, handleAssigneeChange};
}
