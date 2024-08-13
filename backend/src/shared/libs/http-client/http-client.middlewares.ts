import { StatusCodes } from "http-status-codes";
import { HttpError } from "./http-client.errors";
import { Request } from "./http-client.types";

export const parseBodyMiddleware = (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
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
