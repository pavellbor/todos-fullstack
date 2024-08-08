import { Task, useTasksStore } from "@/entities/task"

export const useRemoveTask = () => {
    const removeTask = useTasksStore(s => s.removeTask)

    return (task: Task) => removeTask(task.id)
}