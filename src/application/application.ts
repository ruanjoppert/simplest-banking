import { Logger } from './ports/logger.port'
import { ServiceBus } from './ports/service-bus.port'

type ApplicationConfig = {
  commandBus: ServiceBus,
  eventBus: ServiceBus,
  queryBus: ServiceBus,
  logger: Logger,
}

export type interactor = { handle: (dto?: any) => any }
export type callInteractor <T> = (interactorName: string, dto: unknown) => T

export class Application {
  public commandBus: ServiceBus
  public eventBus: ServiceBus
  public queryBus: ServiceBus
  public logger: Logger

  private interactors: Map<string, interactor>

  public constructor ({ commandBus, eventBus, queryBus, logger }: ApplicationConfig) {
    this.commandBus = commandBus
    this.eventBus = eventBus
    this.queryBus = queryBus
    this.logger = logger

    this.interactors = new Map()
  }

  /**
   * Add interactor
   * @param interactorName
   * @param interactor
   */
  public addInteractor (interactorName: string, interactor: interactor) {
    this.interactors.set(interactorName, interactor)

    this.logger.info(`Interactor "${interactorName}" loaded`, {})
  }

  public call <T> (interactorName: string, interactorDTO: unknown): T {
    const interactor = this.interactors.get(interactorName)

    if (!interactor) {
      throw new Error('Interactor not found')
    }

    return interactor.handle(interactorDTO)
  }
}
