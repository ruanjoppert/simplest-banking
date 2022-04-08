import { Event } from '../../infrastructure/event/event.adapter'
import { AccountOpenedDomainEvent, DepositMadeDomainEvent, WithdrawMadeDomainEvent } from './domain/events'

export type AccountEvents =
  Event<AccountOpenedDomainEvent>
  | Event<DepositMadeDomainEvent>
  | Event<WithdrawMadeDomainEvent>

export type AccountDomainEvents =
  AccountOpenedDomainEvent
  | DepositMadeDomainEvent
  | WithdrawMadeDomainEvent
