import { EventHttpController, EventHttpRequestDTO } from '.'
import { Application } from '../../../../application/application'

export default (router: any, app: Application): void => {
  const { eventBus, logger } = app

  const interactorCall = app.call.bind(app)
  const eventHttpController = new EventHttpController(interactorCall, eventBus, logger)

  router.post('/event', (request: any, response: any) => {
    const { type, amount, destination, origin } = request.body

    try {
      const eventHttpRequestDTO = new EventHttpRequestDTO({
        type,
        amount,
        destination,
        origin
      })

      logger.debug('Requested made into "POST /event"', { body: request.body })

      eventHttpController.handle(eventHttpRequestDTO, response)
    } catch (error: any) {
      response.status(400).json({
        message: error.message
      })
    }
  })
}
