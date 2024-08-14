import { StatusCodes } from "http-status-codes";
import { HttpError } from "./http-client.errors";
import { Request, Response } from "./http-client.types";

export const parseBodyMiddleware = async (req: Request) => {
  if (req.method === "GET" || req.method === "DELETE") {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);

        if (!parsedBody) {
          reject(
            new HttpError(
              StatusCodes.BAD_REQUEST,
              "Отправлено пустое тело запроса"
            )
          );
        }

        req.body = parsedBody;
        resolve();
      } catch (err) {
        reject(
          new HttpError(StatusCodes.BAD_REQUEST, "Неверный формат данных")
        );
      }
    });
  });
};

export const setCORSHeadersMiddleware = async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    throw new HttpError(StatusCodes.NO_CONTENT);
  }
};
