export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
};

export type GetAllTodosDto = {
  userId: string;
};

export type GetAllTodosRdo = Omit<Todo, "userId">[];

export type CreateTodoDto = {
  title: string;
  userId: string;
};

export type CreateTodoRdo = {
  id: string;
  title: string;
  completed: boolean;
};

export type UpdateTodoDto = {
  id: string;
  completed: boolean;
  userId: string;
};

export type UpdateTodoRdo = {
  id: string;
  title: string;
  completed: boolean;
};

export type RemoveTodoDto = {
  id: string;
};
