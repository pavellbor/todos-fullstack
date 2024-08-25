import { UserService } from './user.service'
import { StatusCodes } from 'http-status-codes'
import { HttpController, Request, Response } from '../../shared/libs/http-client'
import { validateLoginBodyMiddleware, validateRegisterBodyMiddleware } from './user.middlewares'
import { LoggerService } from '../../shared/libs/logger-service'

export class UserController extends HttpController {
  constructor(
    private readonly userService: UserService,
    protected readonly loggerService: LoggerService,
  ) {
    super(loggerService)

    this.registerRoute({
      pathname: '/api/login',
      method: 'POST',
      handler: this.onLogin.bind(this),
      middlewares: [validateLoginBodyMiddleware],
    })
    this.registerRoute({
      pathname: '/api/register',
      method: 'POST',
      handler: this.onRegister.bind(this),
      middlewares: [validateRegisterBodyMiddleware],
    })
    this.registerRoute({
      pathname: '/api/verify',
      method: 'POST',
      handler: this.onVerify.bind(this),
    })
  }

  private async onLogin(req: Request, res: Response) {
    const { username, password } = req.body as {
      username: string
      password: string
    }
    const data = this.userService.login({ username, password })

    this.sendResponse(res, { statusCode: StatusCodes.OK, data })
  }

  private async onRegister(req: Request, res: Response) {
    const { username, password } = req.body as {
      username: string
      password: string
    }
    const data = this.userService.register({ username, password })

    this.sendResponse(res, { statusCode: StatusCodes.CREATED, data })
  }

  private async onVerify(req: Request, res: Response) {
    const token = this.getAuthorizationToken(req)
    const user = this.userService.verify({ token })

    this.sendResponse(res, {
      statusCode: StatusCodes.OK,
      data: { username: user.username },
    })
  }
}
