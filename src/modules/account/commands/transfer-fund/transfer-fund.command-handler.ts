import { Logger } from '../../../../application/ports/logger.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { AccountRepositoryInterface } from '../../database/repositories/account.repository.interface'
import { AccountServiceDomain } from '../../domain/account.service-domain'
import { Account } from '../../domain/entities/account.entity'
import { TransferFundCommand } from './transfer-fund.command'

export class TransferFundCommandHandler {
  private accountRepo: AccountRepositoryInterface
  private eventBus: ServiceBus
  private logger: Logger

  public constructor (accountRepo: AccountRepositoryInterface, eventBus: ServiceBus, logger: Logger) {
    this.accountRepo = accountRepo
    this.eventBus = eventBus
    this.logger = logger
  }

  public async handle (command: TransferFundCommand) {
    const { from, to, amount } = command

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be greather then 0')
    }

    const origin = await this.accountRepo.findOne(from)

    if (!origin) {
      // this.eventBus.emit('TransferAccountNotFounded',
      //   new IntegrationEvent('TransferAccountNotFounded', { from, to, amount }, command.id)
      // )

      return null
    }

    const destination = await this.accountRepo.findOne(to) || Account.open(to)
    const transfer = AccountServiceDomain.transfer(origin, destination, amount)

    if (transfer === null) {
      // this.eventBus.emit('TransferAccountNotEnoughFunds',
      //   new IntegrationEvent('TransferAccountNotEnoughFunds', { from, to, amount }, command.id)
      // )

      return null
    }

    await this.accountRepo.save(origin)
    await this.accountRepo.save(destination)

    this.logger.info(`Transfer "${amount}" into account "${destination.accountId}", from ${origin.accountId}`, { command })

    return { origin, destination }
  }
}
