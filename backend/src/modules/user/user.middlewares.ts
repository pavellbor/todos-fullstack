import { StatusCodes } from 'http-status-codes'
import { HttpError, Request, Response } from '../../shared/libs/http-client'

export const validateRegisterBodyMiddleware = async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string
    password: string
  }

  if (!username) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Имя пользователя не может быть пустым')
  }

  if (!password) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Пароль не может быть пустым')
  }

  if (username.length < 3) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Имя пользователя должно быть не менее 3 символов')
  }

  if (password.length < 6) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Пароль должен быть не менее 6 символов')
  }
}

export const validateLoginBodyMiddleware = async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string
    password: string
  }

  if (!username) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Имя пользователя не может быть пустым')
  }

  if (!password) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Пароль не может быть пустым')
  }
}
