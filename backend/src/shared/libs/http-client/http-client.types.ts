import { RequestListener as RequestHandler } from "http";

export type Route = {
  pathname: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  handler: (req: Request, res: Response) => Promise<void>;
};

export type Request = Parameters<RequestHandler>[0] & {
  params: Record<string, string>;
};
export type Response = Parameters<RequestHandler>[1];
