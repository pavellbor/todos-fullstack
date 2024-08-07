import { Task, useTasks } from "@/entities/task";

export const useToggleTask = () => {
  const updateTask = useTasks((s) => s.updateTask);

  return (task: Task) => {
    const { id, title, completed } = task;
    updateTask(id, { title, completed: !completed });
  };
};
