import fs from "node:fs";

export class FileManager<T> {
  constructor(
    private readonly file: string,
    private readonly encoding: BufferEncoding = "utf-8"
  ) {}

  public write(data: T) {
    const stringifiedData = JSON.stringify(data);
    fs.writeFileSync(this.file, stringifiedData, this.encoding);
  }

  public read(): T | null {
    const stringifiedData = fs.readFileSync(this.file, this.encoding);
    if (!stringifiedData) {
      return null;
    }
    return JSON.parse(stringifiedData);
  }
}
