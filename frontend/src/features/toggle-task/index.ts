import { Task, useTasksStore } from "@/entities/task";

export const useToggleTask = () => {
  const updateTask = useTasksStore((s) => s.updateTask);

  return (task: Task) => {
    const { id, title, completed } = task;
    updateTask(id, { title, completed: !completed });
  };
};
