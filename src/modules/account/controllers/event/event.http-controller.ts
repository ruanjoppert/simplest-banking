import { IntegrationEvent } from '../../../../application/events/integration-event'
import { Logger } from '../../../../application/ports/logger.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { DeferredPromise } from '../../../../utils/defered-promise.util'
import { DepositFundCommand } from '../../commands/deposit-fund/deposit-fund.command'
import { TransferFundCommand } from '../../commands/transfer-fund/transfer-fund.command'
import { WithdrawFundCommand } from '../../commands/withdraw-fund/withdraw-fund.command'
import { EventHttpRequestDTO } from './event.http-request.dto'

type Saga = { promise: DeferredPromise, events: string[], data: any }

export class EventHttpController {
  private commandBus: ServiceBus
  private eventBus: ServiceBus
  private logger: Logger

  private handleSagas: Map<string, Saga[]> = new Map()

  public static awaitConfirmationTimeoutMS = 3000

  constructor (commandBus: ServiceBus, eventBus: ServiceBus, logger: Logger) {
    this.commandBus = commandBus
    this.eventBus = eventBus
    this.logger = logger

    /**
     * Event list for complete sagas
     */
    this.listenEvents(
      'AccountBalanceUpdated',
      'WithdrawAccountNotFounded', 'WithdrawFundCommand', 'WithdrawAccountNotEnoughFunds',
      'TransferAccountNotFounded', 'TransferAccountNotEnoughFunds', 'TransferFundMade'
    )

    this.logger.debug('Controller loaded "EventHttpController"')
  }

  public async handle (request: EventHttpRequestDTO, response: any): Promise<void> {
    const { type } = request.operation

    this.logger.debug(`EventHttpControler handling "${type}" operation`, { request })

    /**
     * Deposit
     */
    if (type === 'deposit') {
      const { destination, amount } = request.operation

      const event = new IntegrationEvent('DepositFundCommand',
        new DepositFundCommand({ accountId: destination, amount: amount })
      )

      this.commandBus.emit('DepositFundCommand', event)

      this.saga(event.id, 'AccountBalanceUpdated')
        .then((event: any) => ({ destination: { id: event.accountId, balance: event.balance } }))
        .then((res: any) => response.status(201).send(res))
    }

    /**
     * Withdraw
     */
    if (type === 'withdraw') {
      const { origin, amount } = request.operation

      const event = new IntegrationEvent('WithdrawFundCommand',
        new WithdrawFundCommand({ accountId: origin, amount: amount })
      )
      this.commandBus.emit('WithdrawFundCommand', event)

      this.saga(event.id, 'AccountBalanceUpdated')
        .then((event: any) => ({ destination: { id: event.accountId, balance: event.balance } }))
        .then((res: any) => response.status(201).send(res))

      this.saga(event.id, 'WithdrawAccountNotFounded')
        .then(() => response.status(404).send('0'))

      this.saga(event.id, 'WithdrawAccountNotEnoughFunds')
        .then(() => response.status(400).send('0'))
    }

    /**
     * Transfer
     */
    if (type === 'transfer') {
      const { origin, destination, amount } = request.operation

      const event = new IntegrationEvent('TransferFundCommand',
        new TransferFundCommand({ from: origin, to: destination, amount })
      )
      this.commandBus.emit('TransferFundCommand', event)

      this.saga(event.id, 'TransferAccountNotFounded')
        .then(() => response.status(404).send('0'))

      this.saga(event.id, 'TransferAccountNotEnoughFunds')
        .then(() => response.status(400).send('0'))

      this.saga(event.id, 'TransferFundMade')
        .then((event: any) => ({ origin: { id: event.origin.accountId, balance: event.origin.balance }, destination: { id: event.destination.accountId, balance: event.destination.balance } }))
        .then((res: any) => response.status(201).send(res))
    }
  }

  // --------------------------------------------------------------------------

  /**
   * Listen eventBus events
   * @param events
   */
  private listenEvents (...events: string[]) {
    for (const eventName of events) {
      this.eventBus.on(eventName, (event) => this.resolve(eventName, event))
    }
  }

  /**
   * Resolve events saga
   * @param eventName
   * @param event
   */
  private resolve (eventName: string, event: IntegrationEvent<'', object>) {
    const { correlationId } = event

    if (!this.handleSagas.get(correlationId)) {
      return
    }

    const sagas = this.handleSagas.get(correlationId)

    const teste = sagas?.map(({ promise, events, data }) => {
      const remaining = events.filter(e => e !== eventName)

      events.includes(eventName) && data.push({ [eventName]: event.data })

      if (!remaining.length) {
        promise.resolve(data.length === 1 ? data[0][eventName] : data)
        this.handleSagas.delete(correlationId)

        return false
      }

      return { promise, events: remaining, data }
    }).filter(Boolean) as Saga[]

    if (this.handleSagas.get(correlationId)) {
      this.handleSagas.set(correlationId, teste)
    }
  }

  /**
   * Register a new saga
   * @param correlationId
   * @param events
   */
  private saga (correlationId: string, ...events: string[]) {
    const promise = new DeferredPromise()

    if (!this.handleSagas.get(correlationId)) {
      this.handleSagas.set(correlationId, [])
    }

    this.handleSagas.get(correlationId)?.push({ promise, events, data: [] })

    return promise
  }
}
