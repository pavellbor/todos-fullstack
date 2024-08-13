import { StatusCodes } from "http-status-codes";
import { Request, Response, Route } from "./http-client.types";
import { HttpError } from "./http-client.errors";

export class HttpController {
  protected routes: Route[] = [];

  public getRoutes() {
    return this.routes;
  }

  protected registerRoute(route: Route) {
    this.routes.push(route);
  }

  protected sendResponse(
    res: Response,
    statusCode: StatusCodes,
    data?: object
  ) {
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
    });

    if (data) {
      res.end(JSON.stringify(data));
    } else {
      res.end();
    }
  }

  protected getAuthorizatonToken(req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Требуется авторизация");
    }

    return authHeader.split(" ")[1];
  }
}
