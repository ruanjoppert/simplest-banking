import { EventEmitter } from 'stream'
import { ServiceBus } from '../../application/ports/service-bus.port'
import { Event } from '../event/event.adapter'

export class InMemoryServiceBus extends EventEmitter implements ServiceBus {
  /**
   * Publish events
   * @param events
   */
  public publish (...events: object[]): void {
    events.map(ev => this.emit(ev.constructor.name, this._event(ev)))
  }

  /**
   * Listen event
   * @param event
   * @param callback
   */
  public listen (event: string | string[], callback: (event: any) => any) {
    const events = Array.isArray(event) ? event : [event]

    events.forEach(ev => this.on(ev, callback))
  }

  // --------------------------------------------------------------------------

  private _event<T extends object> (event: T): Event<T> {
    return new Event(event)
  }
}
