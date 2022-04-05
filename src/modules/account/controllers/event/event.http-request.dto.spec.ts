import { EventHttpRequestDTO } from './event.http-request.dto'

describe('Event HttpRequest DTO', () => {
  test('When requested with invalid data, should throw an error', () => {
    const dto = ({ type, amount, destination, origin }: any) => () => new EventHttpRequestDTO({ type, amount, destination, origin })

    expect(dto({ type: 'deposit', amount: -10, destination: '100' })).toThrowError()
    expect(dto({ type: 'deposit', amount: 10, destination: 100 })).toThrowError()

    expect(dto({ type: 'withdraw', amount: -10, origin: '100' })).toThrowError()
    expect(dto({ type: 'transfer', amount: 100, origin: '100' })).toThrowError()
  })

  test('When requested with valid credentials, should create', () => {
    const deposit = new EventHttpRequestDTO({ type: 'deposit', amount: 100, destination: '200' })
    const withdraw = new EventHttpRequestDTO({ type: 'withdraw', amount: 100, origin: '100' })
    const transfer = new EventHttpRequestDTO({ type: 'transfer', amount: 100, destination: '150', origin: '50' })

    expect(deposit).toBeInstanceOf(EventHttpRequestDTO)
    expect(deposit.operation.type === 'deposit' && deposit.operation.destination).toBe('200')
    expect(deposit.operation.amount).toBe(100)

    expect(withdraw).toBeInstanceOf(EventHttpRequestDTO)
    expect(withdraw.operation.type === 'withdraw' && withdraw.operation.origin).toBe('100')
    expect(withdraw.operation.amount).toBe(100)

    expect(transfer).toBeInstanceOf(EventHttpRequestDTO)
    expect(transfer.operation.type === 'transfer' && transfer.operation.origin).toBe('50')
    expect(transfer.operation.type === 'transfer' && transfer.operation.destination).toBe('150')
    expect(transfer.operation.amount).toBe(100)
  })
})
