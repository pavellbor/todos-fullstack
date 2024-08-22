import crypto from 'node:crypto'

export class HashingService {
  constructor(
    private readonly saltRounds: number,
    private readonly algorithm = 'sha256',
  ) {}

  hash(value: string) {
    let hash = ''

    for (let i = 0; i < this.saltRounds; i++) {
      hash = crypto
        .createHash(this.algorithm)
        .update(hash + value)
        .digest('hex')
    }

    return '$2b$' + this.saltRounds + '$' + hash
  }

  compare(value: string, hashedValue: string) {
    return this.hash(value) === hashedValue
  }
}
