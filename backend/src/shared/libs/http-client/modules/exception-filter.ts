import { StatusCodes } from 'http-status-codes'
import { HttpError, HttpException } from '../http-client.errors'
import { ContentType, Response } from '../http-client.types'
import { LoggerService } from '../../logger-service'

export class ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  public handleException(res: Response, exception: unknown) {
    if (exception instanceof HttpError) {
      this.sendResponse(res, {
        statusCode: exception.statusCode,
        data: {
          message: exception.data,
        },
      })
    } else if (exception instanceof HttpException) {
      this.sendResponse(res, {
        statusCode: exception.statusCode,
        contentType: exception.contentType,
        data: exception.data,
      })
    } else {
      const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      const message = 'Неизвестная ошибка. Попробуйте позже'
      this.sendResponse(res, {
        statusCode,
        data: { message },
      })

      this.loggerService.error({
        source: `${this.constructor.name}`,
        message: `${statusCode}: ${message}`,
        metadata: (exception as Error).stack,
      })
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
