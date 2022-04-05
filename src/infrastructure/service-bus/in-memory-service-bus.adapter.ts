import { EventEmitter } from 'stream'
import { ServiceBus } from '../../application/ports/service-bus.port'

export class InMemoryServiceBus extends EventEmitter implements ServiceBus {
  publish (...events: object[]): void {
    events.map(ev => this.emit(ev.constructor.name, ev))
  }
}
