import { DatabaseClient } from "../../shared/libs/database-client";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../shared/libs/http-client";
import { TokenService } from "../../shared/libs/token-service";
import {
  LoginDto,
  LoginRdo,
  RegisterDto,
  RegisterRdo,
  TokenPayload,
  User,
  VerifyDto,
  VerifyRdo,
} from "./user.types";

export class UserService {
  constructor(
    private readonly databaseClient: DatabaseClient<User>,
    private readonly tokenService: TokenService<TokenPayload>
  ) {}

  public login(loginDto: LoginDto): LoginRdo {
    if (this.authenticate(loginDto.username, loginDto.password)) {
      const user = this.getUserByUsername(loginDto.username)!;
      return { token: this.generateToken(user.id) };
    }

    throw new HttpError(
      StatusCodes.UNAUTHORIZED,
      "Неправильное имя пользователя или пароль"
    );
  }

  public register(registerDto: RegisterDto): RegisterRdo {
    const existsUser = this.getUserByUsername(registerDto.username);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Пользователь с таким именем уже существует"
      );
    }

    this.databaseClient.add({
      username: registerDto.username,
      password: registerDto.password,
    });

    const newUser = this.getUserByUsername(registerDto.username)!;

    return {
      username: newUser.username,
      token: this.generateToken(newUser.id),
    };
  }

  verify(verifyDto: VerifyDto): VerifyRdo {
    try {
      const id = this.verifyToken(verifyDto.token);
      const user = this.databaseClient.getById(id);

      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      console.error(error);
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        "Неверный токен авторизации"
      );
    }
  }

  private authenticate(username: string, password: string) {
    const user = this.getUserByUsername(username);

    return user && user.password === password;
  }

  private getUserByUsername(username: string) {
    const users = this.databaseClient.getAll();
    return users.find((x) => x.username === username);
  }

  private generateToken(id: string) {
    return this.tokenService.generateToken({ id });
  }

  private verifyToken(token: string) {
    const decoded = this.tokenService.verifyToken(token);
    return decoded.id;
  }
}
