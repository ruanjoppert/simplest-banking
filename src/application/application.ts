import { Logger } from './ports/logger.port'
import { Model } from './ports/model.port'
import { ServiceBus } from './ports/service-bus.port'

type ApplicationConfig = {
  commandBus: ServiceBus,
  eventBus: ServiceBus,
  queryBus: ServiceBus,
  logger: Logger,
  accountQueryModel: Model
}

export class Application {
  public commandBus: ServiceBus
  public eventBus: ServiceBus
  public queryBus: ServiceBus
  public logger: Logger
  public accountQueryModel: Model

  public constructor ({ commandBus, eventBus, queryBus, logger, accountQueryModel }: ApplicationConfig) {
    this.commandBus = commandBus
    this.eventBus = eventBus
    this.queryBus = queryBus
    this.logger = logger
    this.accountQueryModel = accountQueryModel
  }
}
