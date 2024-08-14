import { apiClient } from "@/shared/lib/api-client";
import { CreateTaskData, Task, UpdateTaskData } from "../model/task.type";

export const tasksApi = {
  async createTask(data: CreateTaskData) {
    const { data: response } = await apiClient.post<{ id: string }>(
      "/api/todos",
      data
    );
    return response;
  },
  async updateTask(id: string, data: UpdateTaskData) {
    const { data: response } = await apiClient.patch<{ message: string }>(
      `/api/todos/${id}`,
      data
    );
    return response;
  },
  async removeTask(id: string) {
    const { data: response } = await apiClient.delete(`/api/todos/${id}`);
    return response;
  },
  async getTasks() {
    const { data: response } = await apiClient.get<Task[]>("/api/todos");
    return response;
  },
};
