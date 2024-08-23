import { Task, useTasksStore } from '@/entities/task'
import { isApiError } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useNotification } from '@/shared/lib/notification'

export const useRemoveTask = () => {
  const removeTask = useTasksStore((s) => s.removeTask)
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()

  return async (task: Task) => {
    try {
      showLoader()
      await removeTask(task.id)
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    } finally {
      hideLoader()
    }
  }
}
