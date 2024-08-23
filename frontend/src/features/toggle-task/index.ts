import { Task, useTasksStore } from '@/entities/task'
import { isApiError } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useNotification } from '@/shared/lib/notification'

export const useToggleTask = () => {
  const { showNotification } = useNotification()
  const updateTask = useTasksStore((s) => s.updateTask)
  const { showLoader, hideLoader } = useLoader()

  return async (task: Task) => {
    try {
      showLoader()
      const { id, title, completed } = task
      await updateTask(id, { title, completed: !completed })
    } catch (err: unknown) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    } finally {
      hideLoader()
    }
  }
}
