import { Model } from '../../application/ports/model.port'

export class InMemoryStateStore implements Model {
  private records: any[] = []

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
}
