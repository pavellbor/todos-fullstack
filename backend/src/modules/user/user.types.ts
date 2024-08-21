export type User = {
  id: string
  username: string
  password: string
}

export type TokenPayload = {
  id: string
}

export type LoginDto = {
  username: string
  password: string
}

export type LoginRdo = {
  token: string
}

export type RegisterDto = {
  username: string
  password: string
}

export type RegisterRdo = {
  username: string
  token: string
}

export type VerifyDto = {
  token: string
}

export type VerifyRdo = {
  id: string
  username: string
}

export type UserConfigSchema = {
  DB_USERS_PATH: string
  TOKEN_SECRET_KEY: string
}
