export class WithdrawFundCommand {
  public readonly accountId: string
  public readonly amount: number

  public constructor (props: WithdrawFundCommand) {
    this.accountId = props.accountId
    this.amount = props.amount
  }
}
