export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type CreateTaskData = Pick<Task, 'title'>

export type UpdateTaskData = Omit<Task, "id">;

export type RemoveTaskData = Pick<Task, "id">;
