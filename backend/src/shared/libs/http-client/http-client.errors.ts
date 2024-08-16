import { StatusCodes } from "http-status-codes";
import { ContentType } from "./http-client.types";

export class HttpException extends Error {
  constructor(
    public readonly statusCode: StatusCodes,
    public readonly contentType?: ContentType,
    public readonly data?: unknown
  ) {
    super();
  }
}

export class HttpError extends HttpException {
  constructor(statusCode: StatusCodes, message: string) {
    super(statusCode, "application/json", message);
  }
}
