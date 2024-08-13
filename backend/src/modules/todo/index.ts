import { ConfigService } from "../../shared/libs/config-service";
import {
  DatabaseClient,
  DatabaseData,
} from "../../shared/libs/database-client";
import { FileManager } from "../../shared/libs/file-manager";
import { UserService } from "../user/user.service";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { Todo } from "./todo.types";

export const createTodoController = (userService: UserService) => {
  const configService = new ConfigService<{ DB_TODOS_PATH: string }>();
  const fileManager = new FileManager<DatabaseData<Todo>>(
    configService.get("DB_TODOS_PATH")
  );
  const databaseClient = new DatabaseClient<Todo>(fileManager);
  const todoService = new TodoService(databaseClient);
  const todoController = new TodoController(userService, todoService);

  return todoController;
};
