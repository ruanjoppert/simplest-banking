import { Logger } from '../../../../application/ports/logger.port'
import { Model } from '../../../../application/ports/model.port'
import { ServiceBus } from '../../../../application/ports/service-bus.port'
import { GetBalanceQuery } from './get-balance.query'

export class GetBalanceQueryHandler {
  private acountModel: Model
  private eventBus: ServiceBus
  private logger: Logger

  public constructor (acountModel: Model, eventBus: ServiceBus, logger: Logger) {
    this.acountModel = acountModel
    this.eventBus = eventBus
    this.logger = logger
  }

  handle (query: GetBalanceQuery) {
    console.log('eae', query)
  }
}
