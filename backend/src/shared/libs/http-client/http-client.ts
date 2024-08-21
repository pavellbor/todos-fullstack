import http from 'node:http'
import { Middleware, Request, Response } from './http-client.types'
import { HttpController } from './http-controller'
import { MiddlewareService } from './modules/middleware-service'
import { RouteService } from './modules/route-service'
import { ExceptionFilter } from './modules/exception-filter'

export class HttpClient {
  constructor(
    private readonly server = http.createServer(),
    private readonly middlewareService = new MiddlewareService(),
    private readonly routeService = new RouteService(),
    private readonly exceptionFilter = new ExceptionFilter(),
  ) {}

  public registerGlobalMiddlewares(middlewares: Middleware[]) {
    middlewares.forEach((middleware) => this.middlewareService.registerMiddleware(middleware))
  }

  public registerController(controller: HttpController) {
    const routes = controller.getRoutes()
    routes.forEach((route) => this.routeService.registerRoute(route))
  }

  public start(port: number) {
    this.setListeners()
    this.listen(port)
  }

  private listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`)
    })
  }

  private async setListeners() {
    this.server.on('request', async (req: Request, res: Response) => {
      try {
        await this.middlewareService.execMiddlewares(req, res)
        await this.routeService.getRouteAndHandle(req, res)
      } catch (exception) {
        this.exceptionFilter.handleException(res, exception)
      }
    })
  }
}
