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

const bootstrap = () => {
  const configService = new ConfigService<{
    PORT: string
    PUBLIC_DIR_PATH: string
  }>()
  const httpClient = new HttpClient()

  const entryPointController = createEntryPointController()
  const userController = createUserController()
  const todoController = createTodoController(createUserService())

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
