import { Middleware, Request, Response } from "../http-client.types";

export class MiddlewareService {
  private readonly middlewares: Middleware[] = [];

  public registerMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  public async execMiddlewares(req: Request, res: Response) {
    for (const middleware of this.middlewares) {
      await middleware(req, res);
    }
  }
}
