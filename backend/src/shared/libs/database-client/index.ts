import { generateId } from '../../helpers'
import { FileManager } from '../file-manager'

export type DatabaseData<T> = Record<string, T>

export class DatabaseClient<T> {
  private data: DatabaseData<T>

  constructor(private readonly fileManager: FileManager<DatabaseData<T>>) {
    this.getData()
  }

  public getAll(filterCb?: (item: T) => boolean) {
    const allItems = structuredClone(Object.values(this.getData()))

    if (filterCb) {
      return allItems.filter(filterCb)
    }

    return allItems
  }

  public getById(id: string) {
    this.getData()
    this.throwErrorIfItemNotExists(id)

    return structuredClone(this.data[id])
  }

  public updateById(id: string, data: T, options?: { replace?: boolean }) {
    this.getData()
    this.throwErrorIfItemNotExists(id)

    this.data[id] = options?.replace ? data : { ...this.data[id], ...data }
    this.saveData()
  }

  public removeById(id: string) {
    this.getData()
    this.throwErrorIfItemNotExists(id)

    delete this.data[id]
    this.saveData()
  }

  public add(data: Omit<T, 'id'>) {
    this.getData()

    const id = generateId()
    const newItem = { id, ...data } as T
    this.data[id] = newItem

    this.saveData()

    return newItem
  }

  private getData() {
    this.data = this.fileManager.read() || {}
    return this.data
  }

  private saveData() {
    this.fileManager.write(this.data)
  }

  private throwErrorIfItemNotExists(id: string) {
    if (!this.data[id]) {
      throw new Error(`Записи c id "${id}" не сущеcтвует`)
    }
  }
}
