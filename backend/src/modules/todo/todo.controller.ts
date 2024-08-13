import { StatusCodes } from "http-status-codes";
import {
  HttpController,
  Request,
  Response,
} from "../../shared/libs/http-client";
import { UserService } from "../user/user.service";
import { TodoService } from "./todo.service";

export class TodoController extends HttpController {
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService
  ) {
    super();

    this.registerRoute({
      pathname: "/api/todos",
      method: "GET",
      handler: this.onGetAll.bind(this),
    });
    this.registerRoute({
      pathname: "/api/todos",
      method: "POST",
      handler: this.onCreate.bind(this),
    });
    this.registerRoute({
      pathname: "/api/todos/:todoId",
      method: "PUT",
      handler: this.onUpdate.bind(this),
    });
    this.registerRoute({
      pathname: "/api/todos/:todoId",
      method: "DELETE",
      handler: this.onRemove.bind(this),
    });
  }

  private async onGetAll(req: Request, res: Response) {
    const { id: userId } = this.checkAuthorization(req);
    const todos = this.todoService.getAll({ userId });

    this.sendResponse(res, StatusCodes.OK, todos);
  }

  private async onCreate(req: Request, res: Response) {
    const { id: userId } = this.checkAuthorization(req);
    const { title } = req.body as { title: string };
    const todo = this.todoService.create({
      title,
      userId,
    });

    this.sendResponse(res, StatusCodes.CREATED, todo);
  }

  private async onUpdate(req: Request, res: Response) {
    const { todoId } = req.params;
    const { id: userId } = this.checkAuthorization(req);
    const { completed } = req.body as { completed: boolean };
    const updatedTodo = this.todoService.update({
      id: todoId,
      userId,
      completed,
    });

    this.sendResponse(res, StatusCodes.OK, updatedTodo);
  }

  private async onRemove(req: Request, res: Response) {
    this.checkAuthorization(req);
    const { todoId } = req.params;
    this.todoService.remove({ id: todoId });
    this.sendResponse(res, StatusCodes.NO_CONTENT);
  }

  private checkAuthorization(req: Request) {
    const token = this.getAuthorizatonToken(req);
    const user = this.userService.verify({ token });
    return user;
  }
}
