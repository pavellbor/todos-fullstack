import fs from 'node:fs'

type LogPayload = {
  source: string
  message: string
  metadata?: string
}

type LogLevel = 'info' | 'warn' | 'error'

export class LoggerService {
  constructor(private readonly filePath: string) {}

  info(payload: LogPayload) {
    this.log('info', payload)
  }

  warn(payload: LogPayload) {
    this.log('warn', payload)
  }

  error(payload: LogPayload) {
    this.log('error', payload)
  }

  private log(level: LogLevel, { source, message, metadata }: LogPayload) {
    const row = this.createLogEntry({ level, source, message, metadata })

    console[level](row)

    this.appendFile(row)
  }

  private createLogEntry({ level, source, message, metadata }: LogPayload & { level: LogLevel }) {
    const timestamp = new Date().toISOString()
    const formattedMetadata = metadata ? `. Metadata: ${JSON.stringify(metadata)}` : ''

    return `[${timestamp}] [${level.toLowerCase()}] [${source}] ${message}${formattedMetadata} \n`
  }

  private appendFile(logEntry: string) {
    fs.appendFile(this.filePath, logEntry, (err) => {
      if (err) {
        console.error('Ошибка записи в лог:', err)
      }
    })
  }
}
