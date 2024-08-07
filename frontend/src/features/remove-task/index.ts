import { Task, useTasks } from "@/entities/task"

export const useRemoveTask = () => {
    const removeTask = useTasks(s => s.removeTask)

    return (task: Task) => removeTask(task.id)
}