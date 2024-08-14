import { StatusCodes } from "http-status-codes";
import {
  HttpController,
  parseBodyMiddleware,
  Request,
  Response,
} from "../../shared/libs/http-client";
import { UserService } from "../user/user.service";
import { TodoService } from "./todo.service";
import { createParseUserMiddleware, validateCreateTodoBodyMiddleware } from "./todo.middleware";
import { User } from "../user";

export class TodoController extends HttpController {
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService
  ) {
    super();

    const parseUserMiddleware = createParseUserMiddleware((token: string) =>
      this.userService.verify({ token })
    );

    this.registerRoute({
      pathname: "/api/todos",
      method: "GET",
      handler: this.onGetAll.bind(this),
      middlewares: [parseUserMiddleware],
    });
    this.registerRoute({
      pathname: "/api/todos",
      method: "POST",
      handler: this.onCreate.bind(this),
      middlewares: [parseBodyMiddleware, parseUserMiddleware, validateCreateTodoBodyMiddleware],
    });
    this.registerRoute({
      pathname: "/api/todos/:todoId",
      method: "PATCH",
      handler: this.onUpdate.bind(this),
      middlewares: [parseBodyMiddleware, parseUserMiddleware],
    });
    this.registerRoute({
      pathname: "/api/todos/:todoId",
      method: "DELETE",
      handler: this.onRemove.bind(this),
      middlewares: [parseUserMiddleware],
    });
  }

  private async onGetAll(req: Request, res: Response) {
    const { id: userId } = req.user as User;
    const todos = this.todoService.getAll({ userId });

    this.sendResponse(res, StatusCodes.OK, todos);
  }

  private async onCreate(req: Request, res: Response) {
    const { id: userId } = req.user as User;
    const { title } = req.body as { title: string };
    const todo = this.todoService.create({
      title,
      userId,
    });

    this.sendResponse(res, StatusCodes.CREATED, todo);
  }

  private async onUpdate(req: Request, res: Response) {
    const { todoId } = req.params;
    const { id: userId } = req.user as User;
    const { completed } = req.body as { completed: boolean };
    const updatedTodo = this.todoService.update({
      id: todoId,
      userId,
      completed,
    });

    this.sendResponse(res, StatusCodes.OK, updatedTodo);
  }

  private async onRemove(req: Request, res: Response) {
    const { todoId } = req.params;
    this.todoService.remove({ id: todoId });
    this.sendResponse(res, StatusCodes.NO_CONTENT);
  }
}
