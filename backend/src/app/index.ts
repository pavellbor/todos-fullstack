import {
  HttpClient,
  parseBodyMiddleware,
  setCORSHeadersMiddleware,
} from '../shared/libs/http-client'
import { createUserController, createUserService } from '../modules/user'
import { ConfigService } from '../shared/libs/config-service'
import { createTodoController } from '../modules/todo'
import { createReturnStaticFilesMiddleware } from '../shared/libs/http-client/http-client.middlewares'
import { createEntryPointController } from '../modules/entry-point'
import { LoggerService } from '../shared/libs/logger-service'

const bootstrap = () => {
  const configService = new ConfigService<{
    PORT: string
    PUBLIC_DIR_PATH: string
    LOGS_PATH: string
  }>()
  const loggerService = new LoggerService(configService.get('LOGS_PATH'))
  const httpClient = new HttpClient(loggerService)

  const entryPointController = createEntryPointController(loggerService)
  const userController = createUserController(loggerService)
  const todoController = createTodoController(createUserService(loggerService), loggerService)

  httpClient.registerGlobalMiddlewares([
    setCORSHeadersMiddleware,
    parseBodyMiddleware,
    createReturnStaticFilesMiddleware(configService.get('PUBLIC_DIR_PATH')),
  ])

  httpClient.registerController(entryPointController)
  httpClient.registerController(userController)
  httpClient.registerController(todoController)

  httpClient.start(+configService.get('PORT'))
}

bootstrap()
