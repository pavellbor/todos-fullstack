import { apiClient } from '@/shared/lib/api-client'
import { CreateTaskData, Task, UpdateTaskData } from '../model/task.type'

export const tasksApi = {
  async createTask(data: CreateTaskData) {
    const { data: response } = await apiClient.post<{ id: string }>('/todos', data)
    return response
  },
  async updateTask(id: string, data: UpdateTaskData) {
    const { data: response } = await apiClient.patch<{ message: string }>(`/todos/${id}`, data)
    return response
  },
  async removeTask(id: string) {
    const { data: response } = await apiClient.delete(`/todos/${id}`)
    return response
  },
  async getTasks() {
    const { data: response } = await apiClient.get<Task[]>('/todos')
    return response
  },
}
