import { Logger } from '../../../../application/ports/logger.port'
import { Model } from '../../../../application/ports/model.port'
import { GetBalanceQuery } from './get-balance.query'

export class GetBalanceQueryHandler {
  private logger: Logger
  private acountModel: Model

  constructor (acountModel: Model, logger: Logger) {
    this.acountModel = acountModel
    this.logger = logger

    this.logger.debug('Controller loaded "GetBalanceHttpController"')
  }

  public async handle (query: GetBalanceQuery) {
    const { accountId } = query

    const account = await this.acountModel.findOne(accountId)

    if (!account) {
      return null
    }

    return account
  }
}
