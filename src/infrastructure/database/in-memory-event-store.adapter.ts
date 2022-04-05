import { EventStore } from '../../application/ports/event-store.port'

export class InMemoryEventStore<Events> implements EventStore<Events> {
  private events: { readonly streamId: string; readonly event: string }[] = []

  /**
   * Append events to stream
   * @param streamId
   * @param events
   */
  public async appendToStream (streamId: string, events: Events[]): Promise<void> {
    const serialisedEvents = events.map((event) => {
      return { streamId: streamId, event: JSON.stringify(event) }
    })

    this.events.push(...serialisedEvents)
  }

  /**
   * Returns the stream by stream id
   * @param streamId
   * @returns
   */
  public async readFromStream (streamId: string): Promise<Events[] | null> {
    return this.events
      .filter(event => event.streamId === streamId)
      .map(event => JSON.parse(event.event))
  }
}
