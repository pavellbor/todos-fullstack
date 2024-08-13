import { useTaskFilterStore } from "@/features/filter-tasks";
import clsx from "clsx";

export const TaskFilter = () => {
  const filter = useTaskFilterStore(s => s.filter);
  const setFilter = useTaskFilterStore(s => s.setFilter);

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
