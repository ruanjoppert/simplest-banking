import { EventEmitter } from 'stream'

export interface ServiceBus extends EventEmitter {
  publish(...events: object[]): void
}
