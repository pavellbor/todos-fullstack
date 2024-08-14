import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
    public statusCode: number;
  
    constructor(statusCode: StatusCodes, message?: string) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  