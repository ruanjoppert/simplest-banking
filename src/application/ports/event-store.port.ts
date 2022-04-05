export interface AppendToStream<Events> {
  appendToStream(streamId: string, events: Events[]): Promise<void>
}

export interface ReadFromStream<Events> {
  readFromStream(id: string): Promise<Events[] | null>
}

export interface EventStore <Events> extends AppendToStream<Events>,
  ReadFromStream<Events> {}
