import { IntegrationEvent } from '../../../../application/events/integration-event'
import { Logger } from '../../../../application/ports/logger.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { AccountRepositoryInterface } from '../../database/repositories/account.repository.interface'
import { Account } from '../../domain/entities/account.entity'
import { DepositFundCommand } from './deposit-fund.command'

export class DepositFundCommandHandler {
  private accountRepo: AccountRepositoryInterface
  private eventBus: ServiceBus
  private logger: Logger

  public constructor (accountRepo: AccountRepositoryInterface, eventBus: ServiceBus, logger: Logger) {
    this.accountRepo = accountRepo
    this.eventBus = eventBus
    this.logger = logger
  }

  public async handle (command: IntegrationEvent<'DepositFundCommand', DepositFundCommand>): Promise<void> {
    const { accountId, amount } = command.data

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be greather then 0')
    }

    const account = await this.accountRepo.findOne(accountId) || Account.open(accountId)

    account.deposit(amount)
    await this.accountRepo.save(account)

    this.eventBus.emit('AccountBalanceUpdated',
      new IntegrationEvent('AccountBalanceUpdated', { accountId: account.accountId, balance: account.balance }, command.id)
    )

    this.logger.info(`Depoist "${amount}" into account "${account.accountId}", current balance: ${account.balance}`, { command })
  }
}
