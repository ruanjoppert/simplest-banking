export interface ServiceBus {
  listen(eventName: string | string[], callback: (event: any) => any): void

  publish(...events: object[]): void
}
