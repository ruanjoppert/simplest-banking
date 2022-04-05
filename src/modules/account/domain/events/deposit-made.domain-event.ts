export class DepositMadeDomainEvent {
  public readonly accountId: string
  public readonly amount: number

  public constructor (props: DepositMadeDomainEvent) {
    this.accountId = props.accountId
    this.amount = props.amount
  }
}
