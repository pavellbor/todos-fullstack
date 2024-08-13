import { HttpClient } from "../shared/libs/http-client";
import { createUserController, createUserService } from "../modules/user";
import { ConfigService } from "../shared/libs/config-service";
import { createTodoController } from "../modules/todo";

const bootsrap = () => {
  const configService = new ConfigService<{ PORT: string }>();
  const httpClient = new HttpClient();

  const userController = createUserController();
  const todoController = createTodoController(createUserService())

  httpClient.registerController(userController);
  httpClient.registerController(todoController)
  httpClient.start(+configService.get("PORT"));
};

bootsrap();
