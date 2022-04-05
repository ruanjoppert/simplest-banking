export class GetBalanceQuery {
  public readonly accountId: string

  public constructor (props: GetBalanceQuery) {
    this.accountId = props.accountId
  }
}
