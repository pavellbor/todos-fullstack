import { create } from "zustand";
import { CreateTaskData, Task, UpdateTaskData } from "./task.type";
import { tasksApi } from "../api";

type TasksStore = {
  tasks: Task[];
  loadTasks: () => void;
  createTask: (data: CreateTaskData) => void;
  updateTask: (id: string, data: UpdateTaskData) => void;
  removeTask: (id: string) => void;
};

export const useTasks = create<TasksStore>((set, get) => ({
  tasks: [],
  loadTasks: async () => {
    const tasks = await tasksApi.getTasks();
    set({ tasks });
  },
  createTask: async (data) => {
    await tasksApi.createTask(data);
    get().loadTasks();
  },
  updateTask: async (id: string, data) => {
    await tasksApi.updateTask(id, data);
    get().loadTasks();
  },
  removeTask: async (id) => {
    await tasksApi.removeTask(id);
    get().loadTasks();
  },
}));
