export class DepositFundCommand {
  public readonly accountId: string
  public readonly amount: number

  public constructor (props: DepositFundCommand) {
    this.accountId = props.accountId
    this.amount = props.amount
  }
}
