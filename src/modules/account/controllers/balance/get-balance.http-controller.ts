import { Logger } from '../../../../application/ports/logger.port'
import { Model } from '../../../../application/ports/model.port'
import { GetBalanceHttpRequestDTO } from './get-balance.http-request.dto'

export class GetBalanceHttpController {
  private logger: Logger
  private accountQueryModel: Model

  constructor (accountQueryModel: Model, logger: Logger) {
    this.accountQueryModel = accountQueryModel
    this.logger = logger

    this.logger.debug('Controller loaded "GetBalanceHttpController"')
  }

  public async handle (request: GetBalanceHttpRequestDTO, response: any) {
    const { accountId } = request

    const account = await this.accountQueryModel.findOne(accountId)

    if (!account) {
      response.status(404).send('0')

      return
    }

    response.status(200).send(String(account.balance))
  }
}
