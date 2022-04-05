import { Logger } from '../../../application/ports/logger.port'
import { Model } from '../../../application/ports/model.port'

export class UpdateBalanceEventHandler {
  public model: Model
  public logger: Logger

  public constructor (model: Model, logger: Logger) {
    this.model = model
    this.logger = logger
  }

  public handle (event) {
    const { accountId, balance } = event.data

    this.model.save({ _id: accountId, balance })
  }
}
