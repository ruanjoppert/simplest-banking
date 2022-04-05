import { Application } from '../../application/application'
import { InMemoryEventStore } from '../../infrastructure/database/in-memory-event-store.adapter'
import { AccountIntegrationEvents } from './account.events'
import { DepositFundCommandHandler } from './commands/deposit-fund/deposit-fund.command-handler'
import { TransferFundCommandHandler } from './commands/transfer-fund/transfer-fund.command-handler'
import { WithdrawFundCommandHandler } from './commands/withdraw-fund/withdraw-fund.command-handler'
import { AccountRepository } from './database/repositories/account.repository'
import { UpdateBalanceEventHandler } from './event-handlers/update-balance.event-handler'
import { GetBalanceQueryHandler } from './queries/get-balance/get-balance.query-handler'

/**
 * Initialize the module
 * @param app
 */
export const accountModule = (app: Application) => {
  const { commandBus, queryBus, eventBus, logger, accountQueryModel } = app

  const accountEventStore = new InMemoryEventStore<AccountIntegrationEvents>()
  const accountRepository = new AccountRepository(accountEventStore, eventBus)

  commandBus.on('DepositFundCommand', (event) =>
    new DepositFundCommandHandler(accountRepository, eventBus, logger).handle(event))

  commandBus.on('WithdrawFundCommand', (event) =>
    new WithdrawFundCommandHandler(accountRepository, eventBus, logger).handle(event))

  commandBus.on('TransferFundCommand', (event) =>
    new TransferFundCommandHandler(accountRepository, eventBus, logger).handle(event))

  queryBus.on('GetBalanceQuery', (event) =>
    new GetBalanceQueryHandler(accountQueryModel, eventBus, logger).handle(event))

  eventBus.on('AccountBalanceUpdated', (event) =>
    new UpdateBalanceEventHandler(accountQueryModel, logger).handle(event))
}
