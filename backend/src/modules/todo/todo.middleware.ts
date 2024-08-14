import { StatusCodes } from "http-status-codes";
import { HttpError, Request, Response } from "../../shared/libs/http-client";
import { VerifyRdo } from "../user";
import { CreateTodoDto } from "./todo.types";

export const createParseUserMiddleware = (
  verifyToken: (token: string) => VerifyRdo
) => {
  const parseToken = (req: Request) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Требуется авторизация");
    }

    const token = authHeader.split(" ")[1];
    return token;
  };

  return async (req: Request, res: Response) => {
    const token = parseToken(req);
    const user = verifyToken(token);

    req.user = user;
  };
};

export const validateCreateTodoBodyMiddleware = async (
  req: Request,
  res: Response
) => {
  const { title } = req.body as CreateTodoDto;

  if (!title || title.length < 6) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      "Текст задачи должен быть не менее 6 символов"
    );
  }
};
