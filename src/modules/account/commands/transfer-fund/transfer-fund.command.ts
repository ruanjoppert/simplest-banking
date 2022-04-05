export class TransferFundCommand {
  public readonly from: string
  public readonly amount: number
  public readonly to: string

  public constructor (props: TransferFundCommand) {
    this.from = props.from
    this.amount = props.amount
    this.to = props.to
  }
}
