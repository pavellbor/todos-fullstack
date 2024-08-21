export type ConfigSchema<T> = T & NodeJS.ProcessEnv

export class ConfigService<T extends NodeJS.ProcessEnv> {
  private config: ConfigSchema<T>

  constructor() {
    this.config = process.env as unknown as ConfigSchema<T>
  }

  get(key: keyof T) {
    const value = this.config[key]

    if (!value) {
      throw new Error(`Переменная окружения с ключом ${key.toString()} не задана`)
    }

    return value
  }
}
