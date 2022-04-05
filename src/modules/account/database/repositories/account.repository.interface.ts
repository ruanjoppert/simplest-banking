import { Account } from '../../domain/entities/account.entity'

export interface AccountRepositoryInterface {
  save(account: Account): Promise<void>
  findOne (accountId: string): Promise<Account | null>
}
