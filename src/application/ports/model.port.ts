export interface Model {
  save (row: any): Promise<void>
  findOne (id: string, key?: string): Promise<any>
}
