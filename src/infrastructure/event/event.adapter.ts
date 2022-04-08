import { randomUUID } from 'crypto'

export class Event<DomainEvent extends object> {
  public readonly id: string
  public readonly type: string
  public readonly timestamp: number
  public readonly data: DomainEvent
  public readonly correlationId: string

  public constructor (event: DomainEvent, correlationId?: string) {
    this.id = randomUUID()
    this.type = event.constructor.name
    this.timestamp = Date.now()
    this.correlationId = correlationId || this.id

    this.data = event
  }
}
