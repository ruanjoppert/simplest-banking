/* eslint-disable camelcase */
import { defineFeature, loadFeature } from 'jest-cucumber'
import request from 'supertest'
import { app } from '../../../src'

const feature = loadFeature('tests/account/withdraw/withdraw-fund.feature')

defineFeature(feature, test => {
  test('Withdraw fund from non-existing account', ({ when, then }) => {
    let requestDTO
    when(/^I request a withdrawal of (\d+) \$ebx from account (\d+)$/, async (amount, origin) => {
      requestDTO = { type: 'withdraw', origin, amount: amount }
    })

    then('I should get a warning that the account doesn\'t exist', () => {
      // request(app)
      //   .post('/events')
      //   .send(requestDTO)
      //   .expect(404)
      //   .then(res => expect(res).toBe(0))
    })
  })

  test('Withdraw from existing account', ({ when, then }) => {
    let requestDTO

    when(/^I request a withdrawal of (\d+) \$ebx from account (\d+)$/, (amount, origin) => {
      requestDTO = { type: 'withdraw', origin, amount }
    })

    then(/^Account (\d+) should have (\d+) \$ebx$/, (origin, balance) => {
      // request(app)
      //   .post('/events')
      //   .send(requestDTO)
      //   .expect(201)
      //   .then(res => expect(res).toBe({ origin: { id: origin, balance } }))
    })
  })

  test('Withdraw when amount greater than the balance', ({ when, then }) => {
    let requestDTO

    when(/^I request a withdrawal of (\d+) \$ebx from account (\d+)$/, (amount, origin) => {
      requestDTO = { type: 'withdraw', origin, amount }
    })

    then('I must be warned that the withdrawal was not made', () => {
      // request(app)
      //   .post('/events')
      //   .send(requestDTO)
      //   .expect(400)
      //   .then(res => expect(res).toBe(0))
    })
  })
})
