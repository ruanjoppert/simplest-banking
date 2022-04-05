import { InMemoryEventStore } from '../../../../infrastructure/database/in-memory-event-store.adapter'
import { AccountRepository } from '../../database/repositories/account.repository'
import { DepositFundCommand } from './deposit-fund.command'
import { DepositFundCommandHandler } from './deposit-fund.command-handler'
import { InMemoryServiceBus } from '../../../../infrastructure/service-bus/in-memory-service-bus.adapter'
import { IntegrationEvent } from '../../../../application/events/integration-event'

describe('Deposit Fund', () => {
  let accountRepository: AccountRepository
  let commandHandler: DepositFundCommandHandler

  beforeEach(() => {
    accountRepository = new AccountRepository(new InMemoryEventStore())
    commandHandler = new DepositFundCommandHandler(accountRepository, new InMemoryServiceBus(), console)
  })

  test('When requested with a invalid command, should throw an error', () => {
    const invalidCommand = new DepositFundCommand({ accountId: '100', amount: 0 })

    // @ts-ignore
    expect(commandHandler.handle(invalidCommand)).rejects.toThrowError()
  })

  test('When requested with valid command, should commit', async () => {
    const command = new DepositFundCommand({ accountId: '100', amount: 10 })
    const handler = await commandHandler.handle(new IntegrationEvent('DepositFundCommand', command))
    const account = await accountRepository.findOne('100')

    expect(handler).toBeUndefined()
    expect(account?.balance).toBe(10)
  })
})
