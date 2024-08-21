import { StatusCodes } from 'http-status-codes'
import { HttpError, HttpException } from './http-client.errors'
import { Request, Response } from './http-client.types'
import path from 'node:path'
import fs from 'node:fs'
import url from 'node:url'

export const parseBodyMiddleware = async (req: Request) => {
  if (req.method === 'GET' || req.method === 'DELETE') {
    return
  }

  return new Promise<void>((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body)

        if (!parsedBody) {
          reject(new HttpError(StatusCodes.BAD_REQUEST, 'Отправлено пустое тело запроса'))
        }

        req.body = parsedBody
        resolve()
      } catch (err) {
        reject(new HttpError(StatusCodes.BAD_REQUEST, 'Неверный формат данных'))
      }
    })
  })
}

export const setCORSHeadersMiddleware = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    throw new HttpException(StatusCodes.NO_CONTENT)
  }
}

export const createReturnStaticFilesMiddleware = (publicDir: string) => {
  return async (req: Request, res: Response) => {
    if (req.method !== 'GET') {
      return
    }

    const { pathname } = url.parse(req.url!)
    const filePath = path.join(publicDir, pathname!.slice(1))
    const ext = path.extname(filePath)

    const contentType = (
      {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      } as const
    )[ext]

    if (!contentType) {
      return
    }

    await new Promise((resolve, reject) =>
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(new HttpError(StatusCodes.NOT_FOUND, 'Файл не найден'))
        }

        reject(new HttpException(StatusCodes.OK, contentType, data))
      }),
    )
  }
}
