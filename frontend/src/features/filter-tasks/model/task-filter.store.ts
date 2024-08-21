import { create } from 'zustand'
import { TaskFilterType } from './type'
import { devtools } from 'zustand/middleware'

type TaskFilterStore = {
  filter: TaskFilterType
  setFilter: (filter: TaskFilterType) => void
}

export const useTaskFilterStore = create(
  devtools<TaskFilterStore>(
    (set) => ({
      filter: 'all',
      setFilter: (filter) => {
        set({ filter }, undefined, { type: 'setFilter', filter })
      },
    }),
    { name: 'taskFilter', store: 'taskFilter' },
  ),
)
