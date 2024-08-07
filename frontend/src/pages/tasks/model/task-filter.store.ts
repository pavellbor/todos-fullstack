import { create } from "zustand";
import { TaskFilter } from "./type";

type TaskFilterStore = {
    filter: TaskFilter,
    setFilter: (filter: TaskFilter) => void
}

export const useTaskFilterStore = create<TaskFilterStore>((set) => ({
    filter: 'all',
    setFilter: (filter) => set({filter})
}))