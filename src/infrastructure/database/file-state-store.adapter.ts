import { Model } from '../../application/ports/model.port'
import fs from 'fs'

export class FileStateStore implements Model {
  private records: any[] = []
  private fileName: string

  public constructor (modelName: string) {
    const dir = './data/'

    this.fileName = `${dir}${modelName}.json`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    // fs.writeFileSync(this.fileName)

    // fs.writeFile(this.fileName, JSON.stringify({}), (err) => {
    //   if (err) {
    //     throw new Error('cannot create FileStateStore')
    //   }
    // })

    console.log(this.data())
  }

  public async save (record: any): Promise<void> {
    if (!record) {
      throw new Error('Record empty')
    }

    const exists = this.records.findIndex(({ _id }) => _id === record._id)

    exists >= 0
      ? this.records.splice(exists, 1, record)
      : this.records.push(record)
  }

  public async findOne (id: string, key = '_id'): Promise<any> {
    return this.records.find(account => account[key] === id)
  }

  public get countRecords () {
    return this.records.length
  }

  private write (record: object) {
    const data = fs.readFileSync(this.fileName) || {}

    console.log('data', data)
  }

  private data () {
    const af = fs.readFileSync(this.fileName).toString()

    return JSON.parse(fs.readFileSync(this.fileName).toString())
  }
}
