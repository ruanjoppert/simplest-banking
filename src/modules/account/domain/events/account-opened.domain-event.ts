export class AccountOpenedDomainEvent {
  public readonly accountId: string

  public constructor (props: AccountOpenedDomainEvent) {
    this.accountId = props.accountId
  }
}
