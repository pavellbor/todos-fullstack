import { StatusCodes } from 'http-status-codes'
import { HttpError, HttpException } from '../http-client.errors'
import { ContentType, Response } from '../http-client.types'

export class ExceptionFilter {
  public handleException(res: Response, exception: unknown) {
    if (exception instanceof HttpError) {
      this.sendResponse(res, {
        statusCode: exception.statusCode,
        data: {
          message: exception.data,
        },
      })

      console.error(exception)
    } else if (exception instanceof HttpException) {
      this.sendResponse(res, {
        statusCode: exception.statusCode,
        contentType: exception.contentType,
        data: exception.data,
      })
    } else {
      this.sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          message: 'Неизвестная ошибка. Попробуйте позже',
        },
      })

      console.error(exception)
    }
  }

  private sendResponse(
    res: Response,
    {
      statusCode,
      contentType = 'application/json',
      data,
    }: {
      statusCode: StatusCodes
      contentType?: ContentType
      data?: unknown
    },
  ) {
    res.writeHead(statusCode, {
      'Content-Type': contentType,
    })

    if (data) {
      res.end(contentType === 'application/json' ? JSON.stringify(data) : data)
    } else {
      res.end()
    }
  }
}
