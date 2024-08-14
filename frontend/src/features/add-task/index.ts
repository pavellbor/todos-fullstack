import { CreateTaskData, useTasksStore } from "@/entities/task";
import { isApiError } from "@/shared/lib/api-client";
import { useNotification } from "@/shared/lib/notification";

export const useAddTask = () => {
  const createTask = useTasksStore((s) => s.createTask);
  const { showNotification } = useNotification();

  return async (data: CreateTaskData) => {
    try {
      await createTask(data);
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message);
      }
    }
  };
};
