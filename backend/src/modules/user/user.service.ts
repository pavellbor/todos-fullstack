import { DatabaseClient } from '../../shared/libs/database-client'
import { StatusCodes } from 'http-status-codes'
import { HttpError } from '../../shared/libs/http-client'
import { TokenService } from '../../shared/libs/token-service'
import {
  LoginDto,
  LoginRdo,
  RegisterDto,
  RegisterRdo,
  TokenPayload,
  User,
  VerifyDto,
  VerifyRdo,
} from './user.types'
import { HashingService } from '../../shared/libs/hashing-service'
import { LoggerService } from '../../shared/libs/logger-service'

export class UserService {
  constructor(
    private readonly databaseClient: DatabaseClient<User>,
    private readonly tokenService: TokenService<TokenPayload>,
    private readonly hashingService: HashingService,
    private readonly loggerService: LoggerService,
  ) {}

  public login(loginDto: LoginDto): LoginRdo {
    this.loggerService.info({
      source: this.constructor.name,
      message: `Аноним пытается войти под ником "${loginDto.username}"`,
    })

    if (this.authenticate(loginDto.username, loginDto.password)) {
      const user = this.getUserByUsername(loginDto.username)!

      this.loggerService.warn({
        source: this.constructor.name,
        message: `Пользователь "${loginDto.username}" успешно вошел`,
      })

      return { token: this.generateToken(user.id) }
    }

    this.loggerService.warn({
      source: this.constructor.name,
      message: `Аноним ввел неправильное имя пользователя или пароль`,
    })

    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Неправильное имя пользователя или пароль')
  }

  public register(registerDto: RegisterDto): RegisterRdo {
    this.loggerService.info({
      source: this.constructor.name,
      message: `Аноним пытается зарегистрироваться`,
    })

    const existsUser = this.getUserByUsername(registerDto.username)

    if (existsUser) {
      this.loggerService.warn({
        source: this.constructor.name,
        message: `Аноним пытается зарегистрироваться под существующим именем "${registerDto.username}"`,
      })

      throw new HttpError(StatusCodes.BAD_REQUEST, 'Пользователь с таким именем уже существует')
    }

    this.loggerService.info({
      source: this.constructor.name,
      message: `Пользователь "${registerDto.username}" зарегистрировался`,
    })

    this.databaseClient.add({
      username: registerDto.username,
      passwordHash: this.createPasswordHash(registerDto.password),
    })

    const newUser = this.getUserByUsername(registerDto.username)!

    return {
      username: newUser.username,
      token: this.generateToken(newUser.id),
    }
  }

  verify(verifyDto: VerifyDto): VerifyRdo {
    try {
      const id = this.verifyToken(verifyDto.token)
      const user = this.databaseClient.getById(id)

      this.loggerService.info({
        source: this.constructor.name,
        message: `Успешная проверка токена для пользователя "${user.username}"`,
      })

      return {
        id: user.id,
        username: user.username,
      }
    } catch (error) {
      this.loggerService.warn({
        source: this.constructor.name,
        message: `Использован неверный токен авторизации: ${verifyDto.token}`,
      })

      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Неверный токен авторизации')
    }
  }

  private authenticate(username: string, password: string) {
    const user = this.getUserByUsername(username)

    return user && this.comparePasswordWithHash(password, user.passwordHash)
  }

  private getUserByUsername(username: string) {
    const users = this.databaseClient.getAll()
    return users.find((x) => x.username === username)
  }

  private generateToken(id: string) {
    return this.tokenService.generateToken({ id })
  }

  private verifyToken(token: string) {
    const decoded = this.tokenService.verifyToken(token)
    return decoded.id
  }

  private createPasswordHash(password: string) {
    return this.hashingService.hash(password)
  }

  private comparePasswordWithHash(password: string, hash: string) {
    return this.hashingService.compare(password, hash)
  }
}
