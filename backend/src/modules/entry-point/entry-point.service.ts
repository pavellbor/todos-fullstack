import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { HttpError } from '../../shared/libs/http-client'
import { StatusCodes } from 'http-status-codes'

export class EntryPointService {
  constructor(private readonly rootHTMLFilePath: string) {}

  async getRootHTML() {
    try {
      const rootHTML = await readFile(path.resolve(this.rootHTMLFilePath))
      return rootHTML
    } catch (error) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Ошибка загрузки корневого HTML файла')
    }
  }
}
