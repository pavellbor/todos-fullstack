import { TaskFilter } from "./task-filter";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";
import { TaskStats } from "./task-stats";

export const Tasks = () => {
  return (
    <>
      <TaskFilter />

      <main className="app-main">
        <TaskList />

        <TaskForm />
      </main>

      <TaskStats />
    </>
  );
};
