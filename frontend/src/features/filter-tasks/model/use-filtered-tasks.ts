import { Task, useTasksStore } from '@/entities/task'
import { useTaskFilterStore } from './task-filter.store'

export const useFilteredTasks = () => {
  const tasks = useTasksStore((s) => s.tasks)
  const filter = useTaskFilterStore((s) => s.filter)

  const filterCb = {
    all: () => true,
    active: (task: Task) => !task.completed,
    done: (task: Task) => task.completed,
  }

  return tasks.filter(filterCb[filter])
}
