import { AccountOpenedDomainEvent, DepositMadeDomainEvent, WithdrawMadeDomainEvent } from '../events'

type AccountDomainEvents = AccountOpenedDomainEvent | DepositMadeDomainEvent

export class Account {
  private readonly _accountId: string

  #balance: number
  #domainEvents: AccountDomainEvents[] = []

  private constructor (accountId: string, balance = 0) {
    this._accountId = accountId
    this.#balance = balance

    this.validate()
  }

  /**
   * Open a new account
   * @param accountId
   */
  public static open (accountId: string): Account {
    const account = new Account(accountId)

    account.addEvent(
      new AccountOpenedDomainEvent({ accountId: account.accountId })
    )

    return account
  }

  /**
   * Deposit fund into account
   * @param amount
   */
  public deposit (amount: number) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error()
    }

    this.#balance += amount

    this.addEvent(
      new DepositMadeDomainEvent({ accountId: this.accountId, amount })
    )
  }

  /**
   * Withdraw fundo from account
   * @param amount
   */
  public withdraw (amount: number) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error()
    }

    this.#balance -= amount

    this.addEvent(
      new WithdrawMadeDomainEvent({ accountId: this.accountId, amount })
    )
  }

  /**
   * Entity business rules validation to protect it's invariant
   */
  public validate () {
    if (typeof this.balance !== 'number') {
      throw new Error()
    }

    if (!this.accountId || typeof this.accountId !== 'string') {
      throw new Error()
    }
  }

  // --------------------------------------------------------------------------

  public get balance (): number {
    return this.#balance
  }

  public get accountId (): string {
    return this._accountId
  }

  // --------------------------------------------------------------------------

  /**
   * Rehydrates the account
   * @param stringId
   * @param fromProps
   */
  public static from (accountId: string, balance: number) :Account {
    const account = new Account(accountId, balance)

    return account
  }

  // --------------------------------------------------------------------------

  private addEvent (event: AccountDomainEvents): void {
    this.#domainEvents.push(event)
  }

  public clearEvents (): void {
    this.#domainEvents = []
  }

  public get events (): AccountDomainEvents[] {
    return this.#domainEvents
  }
}
