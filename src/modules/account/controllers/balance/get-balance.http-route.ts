import { Application } from '../../../../application/application'
import { GetBalanceHttpController } from './get-balance.http-controller'
import { GetBalanceHttpRequestDTO } from './get-balance.http-request.dto'

export default (router: any, app: Application): void => {
  const { logger, accountQueryModel } = app

  const getBalanceHttpController = new GetBalanceHttpController(accountQueryModel, logger)

  router.get('/balance', (request: any, response: any) => {
    const { account_id: accountId } = request.query

    try {
      const getBalanceHttpRequestDTO = new GetBalanceHttpRequestDTO(accountId)

      logger.debug('Requested made into "GET /balance"', { query: request.query })

      getBalanceHttpController.handle(getBalanceHttpRequestDTO, response)
    } catch (error: any) {
      response.status(400).json({
        message: error.message
      })
    }
  })
}
