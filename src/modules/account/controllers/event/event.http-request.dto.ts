export interface DepositFundRequest {
  type: 'deposit'
  destination: string
  amount: number
}

export interface WithdrawFundRequest {
  type: 'withdraw'
  origin: string
  amount: number
}

export interface TransferFundRequest {
  type: 'transfer'
  origin: string
  amount: number
  destination: string
}

type Events = DepositFundRequest
| WithdrawFundRequest
| TransferFundRequest

export class EventHttpRequestDTO {
  public operation: Events

  public constructor (operation: Events) {
    this.operation = operation
    this.operation.amount = Number(this.operation.amount)

    this.validate()
  }

  public validate () {
    const { type, amount } = this.operation

    if (typeof amount !== 'number' || amount <= 0 || isNaN(amount)) {
      throw new Error('Presentation Error: amount must be a number greather then zero')
    }

    if (!['deposit', 'withdraw', 'transfer'].includes(type)) {
      throw new Error('Presentation Error: type must be: deposit, withdraw or transfer')
    }

    if (type === 'deposit' || type === 'transfer') {
      if (typeof this.operation.destination !== 'string') {
        throw new Error('Presentation Error: origin must be a valid account')
      }
    }

    if (type === 'withdraw' || type === 'transfer') {
      if (typeof this.operation.origin !== 'string') {
        throw new Error('Presentation Error: origin must be a valid account')
      }
    }

    this.operation = Object.fromEntries(
      Object.entries(this.operation).filter(([, value]) => typeof value !== 'undefined' && value)
    ) as Events
  }
}
