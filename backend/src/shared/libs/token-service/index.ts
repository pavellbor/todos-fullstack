import jwt, { JwtPayload } from 'jsonwebtoken'

export class TokenService<T extends JwtPayload> {
  constructor(private readonly secretKey: string) {}

  public generateToken(payload: T) {
    return jwt.sign(payload, this.secretKey)
  }

  public verifyToken(token: string) {
    return jwt.verify(token, this.secretKey) as T
  }
}
