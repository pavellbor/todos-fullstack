import { useTasks } from "@/entities/task";
import { TaskItem } from "./task-item";
import { useToggleTask } from "@/features/toggle-task";
import { useRemoveTask } from "@/features/remove-task";
import { useEffect } from "react";
import { useFilteredTasks } from "@/features/filter-tasks";

export const TaskList = () => {
  const tasks = useFilteredTasks()
  const toggleTask = useToggleTask();
  const removeTask = useRemoveTask();


  const loadTasks = useTasks((s) => s.loadTasks);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <ul className="todo-list">
      {tasks.map((task) => {
        return (
          <TaskItem
            task={task}
            key={task.id}
            onToggle={() => toggleTask(task)}
            onRemove={() => removeTask(task)}
          />
        );
      })}
    </ul>
  );
};
