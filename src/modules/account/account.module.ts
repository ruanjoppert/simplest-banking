import { Application } from '../../application/application'
import { InMemoryEventStore } from '../../infrastructure/database/in-memory-event-store.adapter'
import { InMemoryStateStore } from '../../infrastructure/database/in-memory-state-store.adapter'
import { AccountEvents } from './account.events'
import { DepositFundCommandHandler } from './commands/deposit-fund/deposit-fund.command-handler'
import { TransferFundCommandHandler } from './commands/transfer-fund/transfer-fund.command-handler'
import { WithdrawFundCommandHandler } from './commands/withdraw-fund/withdraw-fund.command-handler'
import { AccountRepository } from './database/repositories/account.repository'
import { UpdateBalanceEventHandler } from './event-handlers/update-balance.event-handler'
import { GetBalanceQueryHandler } from './queries/balance/get-balance.query-handler'

/**
 * Initialize the module
 * @param app
 */
export const accountModule = (app: Application) => {
  const { eventBus, logger } = app

  const accountEventStore = new InMemoryEventStore<AccountEvents>()
  const accountRepository = new AccountRepository(accountEventStore, eventBus)

  const accountStateStore = new InMemoryStateStore()

  app.addInteractor('DepositFundCommandHandler',
    new DepositFundCommandHandler(accountRepository, eventBus, logger))

  app.addInteractor('WithdrawFundCommandHandler',
    new WithdrawFundCommandHandler(accountRepository, eventBus, logger))

  app.addInteractor('TransferFundCommandHandler',
    new TransferFundCommandHandler(accountRepository, eventBus, logger))

  app.addInteractor('GetBalanceQueryHandler',
    new GetBalanceQueryHandler(accountStateStore, logger))

  eventBus.listen(['AccountOpenedDomainEvent', 'DepositMadeDomainEvent', 'WithdrawMadeDomainEvent'], (event) =>
    new UpdateBalanceEventHandler(accountStateStore, logger).handle(event))
}
