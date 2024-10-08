import path from 'path'
import { DatabaseData, DatabaseClient } from '../../shared/libs/database-client'
import { FileManager } from '../../shared/libs/file-manager'
import { TokenService } from '../../shared/libs/token-service'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User, TokenPayload, UserConfigSchema } from './user.types'
import { ConfigService } from '../../shared/libs/config-service'
import { HashingService } from '../../shared/libs/hashing-service'
import { LoggerService } from '../../shared/libs/logger-service'
export { VerifyRdo, User } from './user.types'

export const createUserService = (loggerService: LoggerService) => {
  const configService = new ConfigService<UserConfigSchema>()
  const fileManager = new FileManager<DatabaseData<User>>(
    path.resolve(configService.get('DB_USERS_PATH')),
  )
  const databaseClient = new DatabaseClient<User>(fileManager)
  const tokenService = new TokenService<TokenPayload>(configService.get('TOKEN_SECRET_KEY'))
  const hashingService = new HashingService(+configService.get('PASSWORD_SALT_ROUNDS'))
  const userService = new UserService(databaseClient, tokenService, hashingService, loggerService)

  return userService
}

export const createUserController = (loggerService: LoggerService) => {
  const userService = createUserService(loggerService)

  return new UserController(userService, loggerService)
}
