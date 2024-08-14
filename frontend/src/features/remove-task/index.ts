import { Task, useTasksStore } from "@/entities/task";
import { isApiError } from "@/shared/lib/api-client";
import { useNotification } from "@/shared/lib/notification";

export const useRemoveTask = () => {
  const removeTask = useTasksStore((s) => s.removeTask);
  const { showNotification } = useNotification();

  return async (task: Task) => {
    try {
      await removeTask(task.id);
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message);
      }
    }
  };
};
