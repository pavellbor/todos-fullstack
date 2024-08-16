import { RequestListener as RequestHandler } from "http";

export type Route = {
  pathname: string | RegExp;
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  handler: (req: Request, res: Response) => Promise<void>;
  middlewares?: Middleware[];
};

export type Request = Parameters<RequestHandler>[0] & {
  params: Record<string, string>;
  body: Record<string, unknown>;
  user: unknown;
};
export type Response = Parameters<RequestHandler>[1];

export type ContentType =
  | "application/json"
  | "application/javascript"
  | "text/html"
  | "text/css"
  | "image/png"
  | "image/jpeg"
  | "image/svg+xml";

export type Middleware = (req: Request, res: Response) => Promise<void>;
