import { Logger } from '../../../application/ports/logger.port'
import { Model } from '../../../application/ports/model.port'

export class UpdateBalanceEventHandler {
  public model: Model
  public logger: Logger

  public constructor (model: Model, logger: Logger) {
    this.model = model
    this.logger = logger
  }

  public async handle (event) {
    const { accountId, amount } = event.data

    if (event.type === 'AccountOpenedDomainEvent') {
      const { accountId } = event.data

      this.model.save({ _id: accountId, balance: 0 })

      return
    }

    const account = await this.model.findOne(accountId)

    if (event.type === 'DepositMadeDomainEvent') {
      account.balance += amount
    }

    if (event.type === 'WithdrawMadeDomainEvent') {
      account.balance -= amount
    }

    this.model.save(account)
  }
}
