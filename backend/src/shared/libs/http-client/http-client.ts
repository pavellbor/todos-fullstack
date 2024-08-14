import http, { Server } from "node:http";
import { Middleware, Request, Response, Route } from "./http-client.types";
import { HttpController } from "./http-controller";
import url from "node:url";
import { HttpError } from "./http-client.errors";
import { StatusCodes } from "http-status-codes";

export class HttpClient {
  private server: Server;
  private routesMap: Record<string, Route> = {};
  private middlewares: Middleware[];

  constructor() {
    this.server = http.createServer();
  }

  public registerGlobalMiddlewares(middlewares: Middleware[]) {
    this.middlewares = middlewares;
  }

  public registerController(controller: HttpController) {
    const routes = controller.getRoutes();
    routes.forEach(
      (route) =>
        (this.routesMap[this.getRouteKey(route.method, route.pathname)] = route)
    );
  }

  public start(port: number) {
    this.setListeners();
    this.listen(port);
  }

  private listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  }

  private async setListeners() {
    this.server.on("request", async (req: Request, res: Response) => {
      try {
        await this.execMiddlewares(this.middlewares, req, res);
        const route = this.getRoute(req);

        await this.execMiddlewares(route.middlewares, req, res);
        await route.handler(req, res);
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  private getRoute(req: Request): Route {
    const pathname = url.parse(req.url!).pathname!;
    const method = req.method!;

    let route = this.routesMap[this.getRouteKey(method, pathname)];
    if (route) {
      return route;
    }

    for (const routeKey in this.routesMap) {
      const routesMapItem = this.routesMap[routeKey];

      if (routesMapItem.method !== method) {
        continue;
      }

      const paramIndex = routesMapItem.pathname.indexOf(":");
      if (paramIndex === -1) {
        continue;
      }

      if (
        pathname.slice(0, paramIndex - 1) ===
        routesMapItem.pathname.slice(0, paramIndex - 1)
      ) {
        const paramName = routesMapItem.pathname.slice(paramIndex + 1);
        req.params = { [paramName]: pathname.slice(paramIndex) };
        route = routesMapItem;
        break;
      }
    }

    if (!route) {
      throw new HttpError(StatusCodes.NOT_FOUND, "Ресурс не найден");
    }

    return route;
  }

  private getRouteKey(method: string, pathname: string) {
    return `${method}::${pathname}`;
  }

  private handleError(res: Response, error: unknown) {
    if (error instanceof HttpError) {
      this.sendResponse(res, error.statusCode, {
        message: error.message,
      });

      if (error.statusCode !== StatusCodes.NO_CONTENT) {
        console.error(error);
      }
    } else {
      this.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Неизвестная ошибка. Попробуйте позже",
      });

      console.error(error);
    }
  }

  private sendResponse(res: Response, statusCode: StatusCodes, data?: object) {
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
    });

    if (data) {
      res.end(JSON.stringify(data));
    } else {
      res.end();
    }
  }

  private async execMiddlewares(
    middlewares: Middleware[] = [],
    req: Request,
    res: Response
  ) {
    for (const middleware of middlewares) {
      await middleware(req, res);
    }
  }
}
