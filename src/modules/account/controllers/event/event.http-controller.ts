import { Logger } from '../../../../application/ports/logger.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { DepositFundCommand } from '../../commands/deposit-fund/deposit-fund.command'
import { TransferFundCommand } from '../../commands/transfer-fund/transfer-fund.command'
import { WithdrawFundCommand } from '../../commands/withdraw-fund/withdraw-fund.command'
import { Account } from '../../domain/entities/account.entity'
import { EventHttpRequestDTO } from './event.http-request.dto'

export class EventHttpController {
  private call: <T>(interactorName: string, dto: unknown) => T

  private eventBus: ServiceBus
  private logger: Logger

  constructor (call: any, eventBus: ServiceBus, logger: Logger) {
    this.call = call

    this.eventBus = eventBus
    this.logger = logger

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

      const command = new DepositFundCommand({ accountId: destination, amount: amount })
      const account = await this.call<Promise<Account>>('DepositFundCommandHandler', command)

      response.status(201).send({
        destination: {
          id: account.accountId,
          balance: account.balance
        }
      })
    }

    /**
     * Withdraw
     */
    if (type === 'withdraw') {
      const { origin, amount } = request.operation

      const command = new WithdrawFundCommand({ accountId: origin, amount: amount })
      const account = await this.call<Promise<Account>>('WithdrawFundCommandHandler', command)

      if (account === null) {
        return response.status(404).send('0')
      }

      return response.status(201).send({
        origin: {
          id: account.accountId,
          balance: account.balance
        }
      })

      // const event = new IntegrationEvent('WithdrawFundCommand',
      //   new WithdrawFundCommand({ accountId: origin, amount: amount })
      // )
      // this.commandBus.emit('WithdrawFundCommand', event)

      // this.saga(event.id, 'AccountBalanceUpdated')
      //   .then((event: any) => ({ origin: { id: event.accountId, balance: event.balance } }))
      //   .then((res: any) => response.status(201).send(res))

      // this.saga(event.id, 'WithdrawAccountNotFounded')
      //   .then(() => response.status(404).send('0'))

      // this.saga(event.id, 'WithdrawAccountNotEnoughFunds')
      //   .then(() => response.status(400).send('0'))
    }

    /**
     * Transfer
     */
    if (type === 'transfer') {
      const { origin: originId, destination: destinationId, amount } = request.operation

      const command = new TransferFundCommand({ from: originId, to: destinationId, amount })
      const results = await this.call<Promise<{origin: Account, destination: Account}>>('TransferFundCommandHandler', command)

      if (results === null) {
        return response.status(404).send('0')
      }

      const { origin, destination } = results

      return response.status(201).send({
        origin: {
          id: origin.accountId,
          balance: origin.balance
        },
        destination: {
          id: destination.accountId,
          balance: destination.balance
        }
      })
    }
  }
}
