import { StatusCodes } from 'http-status-codes'
import { HttpController, Request, Response } from '../../shared/libs/http-client'
import { UserService } from '../user/user.service'
import { TodoService } from './todo.service'
import { createParseUserMiddleware, validateCreateTodoBodyMiddleware } from './todo.middlewares'
import { User } from '../user'
import { LoggerService } from '../../shared/libs/logger-service'

export class TodoController extends HttpController {
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService,
    protected readonly loggerService: LoggerService,
  ) {
    super(loggerService)

    const parseUserMiddleware = createParseUserMiddleware((token: string) =>
      this.userService.verify({ token }),
    )

    this.registerRoute({
      pathname: '/api/todos',
      method: 'GET',
      handler: this.onGetAll.bind(this),
      middlewares: [parseUserMiddleware],
    })
    this.registerRoute({
      pathname: '/api/todos',
      method: 'POST',
      handler: this.onCreate.bind(this),
      middlewares: [parseUserMiddleware, validateCreateTodoBodyMiddleware],
    })
    this.registerRoute({
      pathname: '/api/todos/:todoId',
      method: 'PATCH',
      handler: this.onUpdate.bind(this),
      middlewares: [parseUserMiddleware],
    })
    this.registerRoute({
      pathname: '/api/todos/:todoId',
      method: 'DELETE',
      handler: this.onRemove.bind(this),
      middlewares: [parseUserMiddleware],
    })
  }

  private async onGetAll(req: Request, res: Response) {
    const { id: userId } = req.user as User
    const todos = this.todoService.getAll({ userId })

    this.loggerService.info({
      source: this.constructor.name,
      message: `Пользователь "${(req.user as User).username}" запросил список из ${todos.length} задач`,
    })

    this.sendResponse(res, { statusCode: StatusCodes.OK, data: todos })
  }

  private async onCreate(req: Request, res: Response) {
    const { id: userId } = req.user as User
    const { title } = req.body as { title: string }
    const todo = this.todoService.create({
      title,
      userId,
    })

    this.loggerService.info({
      source: this.constructor.name,
      message: `Пользователь "${(req.user as User).username}" добавил новую задачу с текстом "${title}"`,
    })

    this.sendResponse(res, { statusCode: StatusCodes.CREATED, data: todo })
  }

  private async onUpdate(req: Request, res: Response) {
    const { todoId } = req.params
    const { id: userId } = req.user as User
    const { completed } = req.body as { completed: boolean }
    const updatedTodo = this.todoService.update({
      id: todoId,
      userId,
      completed,
    })

    this.loggerService.info({
      source: this.constructor.name,
      message: `Пользователь "${(req.user as User).username}" обновил задачу с id "${todoId}"`,
    })

    this.sendResponse(res, { statusCode: StatusCodes.OK, data: updatedTodo })
  }

  private async onRemove(req: Request, res: Response) {
    const { todoId } = req.params
    this.todoService.remove({ id: todoId })

    this.loggerService.info({
      source: this.constructor.name,
      message: `Пользователь "${(req.user as User).username}" удалил задачу с id "${todoId}"`,
    })
    
    this.sendResponse(res, { statusCode: StatusCodes.NO_CONTENT })
  }
}
