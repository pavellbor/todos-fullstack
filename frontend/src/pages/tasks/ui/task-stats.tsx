import { useTasksStore } from '@/entities/task'

export const TaskStats = () => {
  const tasks = useTasksStore((s) => s.tasks)

  const doneCount = tasks.filter((x) => x.completed).length
  const activeCount = tasks.length - doneCount

  return (
    tasks.length > 0 && (
      <footer className='app-footer'>
        {activeCount} more to do, {doneCount} done
      </footer>
    )
  )
}
