import { Account } from './account.entity'

describe('Account', () => {
  describe('Open account', () => {
    test('When open a new account, then balance must be 0', () => {
      const account = Account.open('100')

      expect(account).toBeInstanceOf(Account)
      expect(account.balance).toBe(0)
    })

    test('When open a new account with invalid id, should throw an error', () => {
      const openAccountWithError = (value?: any) => () => Account.open(value)

      expect(openAccountWithError()).toThrowError()
      expect(openAccountWithError(123)).toThrowError()
      expect(openAccountWithError(true)).toThrowError()
      expect(openAccountWithError(null)).toThrowError()
    })
  })

  describe('Deposit fund', () => {
    test('When deposit fund with invalid value, should throw an error', () => {
      const account = Account.open('100')
      const invalid = (value: any) => () => account.deposit(value)

      expect(invalid('10')).toThrowError()
      expect(invalid(null)).toThrowError()
      expect(invalid(true)).toThrowError()
      expect(invalid(undefined)).toThrowError()
    })

    test('When deposit fund, should update the balance', () => {
      const account = Account.open('100')

      account.deposit(10)
      expect(account.balance).toBe(10)

      account.deposit(10)
      expect(account.balance).toBe(20)
    })
  })

  describe('Rehydrate', () => {
    test('When requested to recreate an account from a invalid DTO, should throw an error', () => {
      // @ts-ignore
      const account = (id, balance) => () => Account.from(id, balance)

      expect(account('100', '0')).toThrowError()
      expect(account(100, 0)).toThrowError()
    })

    test('When requested to recreate an account from a valid DTO, should returns', () => {
      const account = Account.from('100', 50)

      expect(account).toBeInstanceOf(Account)
      expect(account.balance).toBe(50)
      expect(account.accountId).toBe('100')
    })
  })
})
