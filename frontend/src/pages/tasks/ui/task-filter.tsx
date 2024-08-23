import { useTasksStore } from '@/entities/task'
import { useTaskFilterStore } from '@/features/filter-tasks'
import clsx from 'clsx'

export const TaskFilter = () => {
  const tasks = useTasksStore((s) => s.tasks)
  const hasCompletedTask = tasks.some((x) => x.completed)
  const filter = useTaskFilterStore((s) => s.filter)
  const setFilter = useTaskFilterStore((s) => s.setFilter)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'done', label: 'Done' },
  ] as const

  return hasCompletedTask ?
      <aside className='app-filters'>
        <section className='toggle-group'>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              className={clsx('button', key === filter && 'button--primary')}
              onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </section>
      </aside>
    : null
}
