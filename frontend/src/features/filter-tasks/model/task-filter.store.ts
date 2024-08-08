import { create } from "zustand";
import { TaskFilterType } from "./type";
import { devtools } from "zustand/middleware";

type TaskFilterStore = {
  filter: TaskFilterType;
  setFilter: (filter: TaskFilterType) => void;
};

export const useTaskFilterStore = create<TaskFilterStore>()(
  devtools((set) => ({
    filter: "all",
    setFilter: (filter) => {
      set({ filter });
    },
  }))
);
