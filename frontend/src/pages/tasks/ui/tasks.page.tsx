import { TaskFilter } from "./task-filter";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";

export const Tasks = () => {
  return (
    <>
      <TaskFilter />

      <main className="app-main">
        <TaskList />

        <TaskForm />
      </main>

      <footer className="app-footer">2 more to do, 1 done</footer>
    </>
  );
};
