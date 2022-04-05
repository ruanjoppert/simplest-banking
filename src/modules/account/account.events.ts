import { IntegrationEvent } from '../../application/events/integration-event'
import { AccountOpenedDomainEvent, DepositMadeDomainEvent, WithdrawMadeDomainEvent } from './domain/events'

export type AccountIntegrationEvents =
  IntegrationEvent<'AccountOpenedDomainEvent', AccountOpenedDomainEvent>
  | IntegrationEvent<'DepositMadeDomainEvent', DepositMadeDomainEvent>
  | IntegrationEvent<'WithdrawMadeDomainEvent', WithdrawMadeDomainEvent>

export type AccountDomainEvents =
  AccountOpenedDomainEvent
  | DepositMadeDomainEvent
  | WithdrawMadeDomainEvent
