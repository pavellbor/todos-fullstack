import clsx from "clsx";
import { useTaskFilterStore } from "../model/task-filter.store";

export const TaskFilter = () => {
  const { filter, setFilter } = useTaskFilterStore();
  const filters = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "done", label: "done" },
  ] as const;

  return (
    <aside className="app-filters">
      <section className="toggle-group">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={clsx("button", key === filter && "button--primary")}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </section>
    </aside>
  );
};
