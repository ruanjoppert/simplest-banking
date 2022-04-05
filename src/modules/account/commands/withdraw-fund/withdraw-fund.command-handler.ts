import { IntegrationEvent } from '../../../../application/events/integration-event'
import { Logger } from '../../../../application/ports/logger.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { AccountRepositoryInterface } from '../../database/repositories/account.repository.interface'
import { WithdrawFundCommand } from './withdraw-fund.command'

export class WithdrawFundCommandHandler {
  private accountRepo: AccountRepositoryInterface
  private eventBus: ServiceBus
  private logger: Logger

  public constructor (accountRepo: AccountRepositoryInterface, eventBus: ServiceBus, logger: Logger) {
    this.accountRepo = accountRepo
    this.eventBus = eventBus
    this.logger = logger
  }

  public async handle (command: IntegrationEvent<'WithdrawFundCommand', WithdrawFundCommand>): Promise<void> {
    const { accountId, amount } = command.data

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be greather then 0')
    }

    const account = await this.accountRepo.findOne(accountId)

    if (!account) {
      this.eventBus.emit('WithdrawAccountNotFounded',
        new IntegrationEvent('WithdrawAccountNotFounded', { accountId }, command.id)
      )

      return
    }

    if (account.balance < amount) {
      this.eventBus.emit('WithdrawAccountNotEnoughFunds',
        new IntegrationEvent('WithdrawAccountNotEnoughFunds', { accountId }, command.id)
      )

      return
    }

    account.withdraw(amount)
    await this.accountRepo.save(account)

    this.eventBus.emit('AccountBalanceUpdated',
      new IntegrationEvent('AccountBalanceUpdated', { accountId: account.accountId, balance: account.balance }, command.id)
    )

    this.logger.info(`Withdraw "${amount}" from account "${account.accountId}", current balance: ${account.balance}`, { command })
  }
}
