import { StatusCodes } from "http-status-codes";
import { ContentType, Request, Response, Route } from "./http-client.types";
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
    {
      statusCode,
      contentType = "application/json",
      data,
    }: {
      statusCode: StatusCodes;
      contentType?: ContentType;
      data?: object;
    }
  ) {
    res.writeHead(statusCode, {
      "Content-Type": contentType,
    });

    if (data) {
      res.end(contentType === "application/json" ? JSON.stringify(data) : data);
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
