import { CreateTaskData, useTasks } from "@/entities/task"

export const useAddTask = () => {
    const createTask = useTasks(s => s.createTask)

    return (data: CreateTaskData) => createTask(data)
}