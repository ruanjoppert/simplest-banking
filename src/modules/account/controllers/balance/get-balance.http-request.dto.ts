export class GetBalanceHttpRequestDTO {
  public accountId: string

  public constructor (accountId: string) {
    this.accountId = accountId

    this.validate()
  }

  public validate () {
    const { accountId } = this

    if (typeof accountId !== 'string' || !accountId.length) {
      throw new Error('Presentation Error: accountid is mandatory')
    }
  }
}
