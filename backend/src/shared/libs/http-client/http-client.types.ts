import { RequestListener as RequestHandler } from "http";

export type Route = {
  pathname: string;
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

export type Middleware = (req: Request, res: Response) => Promise<void>;
