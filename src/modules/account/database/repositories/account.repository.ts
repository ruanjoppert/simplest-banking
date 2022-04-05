import { AccountRepositoryInterface } from './account.repository.interface'
import { Account } from '../../domain/entities/account.entity'
import { AccountIntegrationEvents } from '../../account.events'
import { AccountMapper } from '../mapper/account.mapper'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { EventStore } from '../../../../application/ports/event-store.port'

export class AccountRepository implements AccountRepositoryInterface {
  private adapter: EventStore<AccountIntegrationEvents>
  private eventBus: ServiceBus | undefined

  public constructor (adapter: EventStore<AccountIntegrationEvents>, eventBus?: ServiceBus) {
    this.adapter = adapter
    this.eventBus = eventBus
  }

  public async save (account: Account): Promise<void> {
    if (!(account instanceof Account) || !account.validate) {
      throw new Error('')
    }

    account.validate()

    const events = AccountMapper.toPersistence(account)

    this.adapter.appendToStream(account.accountId, events as AccountIntegrationEvents[])
    this.eventBus?.publish(...account.events)

    account.clearEvents()
  }

  public async findOne (accountId: string): Promise<Account | null> {
    const events = await this.adapter.readFromStream(accountId)

    if (!events?.length) {
      return null
    }

    const account = AccountMapper.toDomain(events)

    return account
  }
}
