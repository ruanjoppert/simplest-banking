import { IntegrationEvent } from '../../../../application/events/integration-event'
import { AccountIntegrationEvents } from '../../account.events'
import { Account } from '../../domain/entities/account.entity'

export class AccountMapper {
  public static toDomain (events: AccountIntegrationEvents[]) {
    const state = events.reduce((account, event) => {
      if (event.type === 'AccountOpenedDomainEvent') {
        account.accountId = event.data.accountId
      }

      if (event.type === 'DepositMadeDomainEvent') {
        account.balance += event.data.amount
      }

      if (event.type === 'WithdrawMadeDomainEvent') {
        account.balance -= event.data.amount
      }

      return account
    }, { accountId: '', balance: 0 })

    return Account.from(state.accountId, state.balance)
  }

  public static toPersistence (account: Account) {
    return account.events.map(ev => new IntegrationEvent(ev.constructor.name, ev))
  }
}
