import { Account } from '../../domain/entities/account.entity'
import { AccountRepository } from './account.repository'
import { InMemoryEventStore } from '../../../../infrastructure/database/in-memory-event-store.adapter'

describe('Account Repository', () => {
  let accountRepository: AccountRepository

  beforeEach(() => {
    accountRepository = new AccountRepository(new InMemoryEventStore())
  })

  describe('Save', () => {
    test('When requested to save an invalid entity, should throw an error', async () => {
      // @ts-ignore
      const save = () => accountRepository.save({ accountId: '123', balance: 0 })

      expect(save).rejects.toThrowError()
    })

    test('When requested to save a valid account, should persist the events', async () => {
      const account = Account.open('100')
      const save = await accountRepository.save(account)

      expect(save).toBeUndefined()
      // @ts-ignore
      expect(accountRepository.adapter.events.length).toBe(1)
      // @ts-ignore
      expect(accountRepository.adapter.events[0].streamId).toBe('100')
    })

    test('When requested to make deposit, should persist the event', async () => {
      const account = Account.open('100')

      account.deposit(10)
      account.deposit(10)

      const save = await accountRepository.save(account)

      expect(save).toBeUndefined()
      // @ts-ignore
      expect(accountRepository.adapter.events.length).toBe(3)
      // @ts-ignore
      expect(accountRepository.adapter.events[0].streamId).toBe('100')
    })
  })

  describe('Find', () => {
    test('When account does not exists, should return null', async () => {
      const find = accountRepository.findOne('100')

      expect(find).resolves.toBeNull()
    })

    test('When account exists, should return the account entity', async () => {
      const account = Account.open('100')
      account.deposit(10)
      account.deposit(10)
      await accountRepository.save(account)

      const find = await accountRepository.findOne('100')

      expect(find).toEqual(account)
    })
  })
})
