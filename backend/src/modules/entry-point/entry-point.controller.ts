import { StatusCodes } from 'http-status-codes'
import { HttpController, Request, Response } from '../../shared/libs/http-client'
import { EntryPointService } from './entry-point.service'
import { LoggerService } from '../../shared/libs/logger-service'

export class EntryPointController extends HttpController {
  constructor(
    private readonly entryPointService: EntryPointService,
    protected readonly loggerService: LoggerService,
  ) {
    super(loggerService)

    this.registerRoute({
      method: 'GET',
      pathname: /^(?!\/api\/).*/,
      handler: this.onGetRootHTML.bind(this),
    })
  }

  async onGetRootHTML(req: Request, res: Response) {
    const indexHTML = await this.entryPointService.getRootHTML()

    this.sendResponse(res, {
      statusCode: StatusCodes.OK,
      data: indexHTML,
      contentType: 'text/html',
    })
  }
}
