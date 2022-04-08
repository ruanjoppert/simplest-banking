import { Logger } from '../../../../application/ports/logger.port'
import { GetBalanceQuery } from '../../queries/balance/get-balance.query'
import { GetBalanceHttpRequestDTO } from './get-balance.http-request.dto'

export class GetBalanceHttpController {
  private call: <T>(interactorName: string, dto: unknown) => T

  private logger: Logger

  constructor (call: any, logger: Logger) {
    this.call = call

    this.logger = logger

    this.logger.debug('Controller loaded "GetBalanceHttpController"')
  }

  public async handle (request: GetBalanceHttpRequestDTO, response: any) {
    const { accountId } = request

    const query = new GetBalanceQuery({ accountId })
    const balance = await this.call<Promise<any>>('GetBalanceQueryHandler', query)

    if (!balance) {
      response.status(404).send('0')

      return
    }

    response.status(200).send(String(balance.balance))
  }
}
