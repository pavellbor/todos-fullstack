import url from "url";
import { Request, Response, Route } from "../http-client.types";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../http-client.errors";
import { MiddlewareService } from "./middleware-service";

export class RouteService {
  private readonly middlewareService: MiddlewareService;
  private readonly routesMap: Record<string, Route>;

  constructor() {
    this.middlewareService = new MiddlewareService();
    this.routesMap = {};
  }

  public registerRoute(route: Route) {
    this.routesMap[this.getRouteKey(route.method, route.pathname.toString())] =
      route;
  }

  public async getRouteAndHandle(req: Request, res: Response) {
    const route = this.getRoute(req);
    await this.handleRoute(req, res, route);
  }

  private getRoute(req: Request) {
    const route =
      this.tryToGetConstantRoute(req) ||
      this.tryToGetRouteWithDynamicParam(req) ||
      this.tryToGetRouteWithRegExp(req);

    if (!route) {
      throw new HttpError(StatusCodes.NOT_FOUND, "Ресурс не найден");
    }

    return route;
  }

  private async handleRoute(req: Request, res: Response, route: Route) {
    if (route.middlewares) {
      route.middlewares.forEach((middleware) =>
        this.middlewareService.registerMiddleware(middleware)
      );
      await this.middlewareService.execMiddlewares(req, res);
    }

    await route.handler(req, res);
  }

  private tryToGetConstantRoute(req: Request) {
    const { pathname, method } = this.getPathnameAndMethod(req);

    return this.routesMap[this.getRouteKey(method, pathname)];
  }

  private tryToGetRouteWithDynamicParam(req: Request) {
    const { pathname, method } = this.getPathnameAndMethod(req);

    for (const routeKey in this.routesMap) {
      const routesMapItem = this.routesMap[routeKey];

      if (
        routesMapItem.method !== method ||
        routesMapItem.pathname instanceof RegExp
      ) {
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
        return routesMapItem;
      }
    }
  }

  private tryToGetRouteWithRegExp(req: Request) {
    const { pathname, method } = this.getPathnameAndMethod(req);

    for (const routeKey in this.routesMap) {
      const routesMapItem = this.routesMap[routeKey];

      if (
        routesMapItem.method !== method ||
        !(routesMapItem.pathname instanceof RegExp)
      ) {
        continue;
      }

      const isMatched = routesMapItem.pathname.test(pathname);

      if (isMatched) {
        return routesMapItem;
      }
    }
  }

  private getPathnameAndMethod(req: Request) {
    const pathname = url.parse(req.url!).pathname!;
    const method = req.method!;

    return { pathname, method };
  }

  private getRouteKey(method: string, pathname: string) {
    return `${method}::${pathname}`;
  }
}
