import http, { Server } from "node:http";
import { Request, Response, Route } from "./http-client.types";
import { HttpController } from "./http-controller";
import url from "node:url";
import { HttpError } from "./http-client.errors";
import { StatusCodes } from "http-status-codes";

export class HttpClient {
  private server: Server;
  private routesMap: Record<string, Route> = {};

  constructor() {
    this.server = http.createServer();
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
      this.setCORSHeaders(req, res);

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      try {
        const route = this.getRoute(req);

        if (route.middlewares?.length) {
          for (const middleware of route.middlewares) {
            await middleware(req, res);
          }
        }

        await route.handler(req, res);
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  private setCORSHeaders(req: Request, res: Response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
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
    console.error(error);

    if (error instanceof HttpError) {
      this.sendResponse(res, error.statusCode, {
        message: error.message,
      });
    } else {
      this.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Неизвестная ошибка. Попробуйте позже",
      });
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
}
