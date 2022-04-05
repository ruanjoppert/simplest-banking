import { Account } from './entities/account.entity'

export class AccountServiceDomain {
  public static transfer (origin: Account, destination: Account, amount: number) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error()
    }

    if (origin.balance < amount) {
      return null
    }

    origin.withdraw(amount)
    destination.deposit(amount)
  }
}
