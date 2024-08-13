import { CreateTaskData, useTasksStore } from "@/entities/task"

export const useAddTask = () => {
    const createTask = useTasksStore(s => s.createTask)

    return (data: CreateTaskData) => createTask(data)
}