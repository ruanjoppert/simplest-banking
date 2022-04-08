// import { randomUUID } from 'crypto'

// export class IntegrationEvent<Type, DomainEvent extends object> {
//   public readonly id: string
//   public readonly timestamp: number
//   public readonly type: Type
//   public readonly data: DomainEvent
//   public readonly correlationId: string

//   public constructor (type: Type, event: DomainEvent, correlationId?: string) {
//     this.id = randomUUID()
//     this.timestamp = Date.now()
//     this.type = type
//     this.correlationId = correlationId || this.id

//     this.data = event
//   }
// }
