import { CreateTaskData, useTasksStore } from '@/entities/task'
import { isApiError } from '@/shared/lib/api-client'
import { useLoader } from '@/shared/lib/loader'
import { useNotification } from '@/shared/lib/notification'

export const useAddTask = () => {
  const createTask = useTasksStore((s) => s.createTask)
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()

  return async (data: CreateTaskData) => {
    try {
      showLoader()
      await createTask(data)
    } catch (err) {
      if (isApiError(err)) {
        showNotification(err.response?.data?.message)
      }
    } finally {
      hideLoader()
    }
  }
}
