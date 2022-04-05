/* eslint-disable camelcase */
import { defineFeature, loadFeature } from 'jest-cucumber'
import request from 'supertest'
import { app } from '../../../src'

const feature = loadFeature('tests/account/deposit/deposit-fund.feature')

defineFeature(feature, test => {
  test('Deposit fund into a new account', ({ when, then, and }) => {
    when(/^I deposit (\d+) \$ebx in account (\d+)$/, async (amount, destination) => {
      const response = await request(app)
        .post('/event')
        .send({ type: 'deposit', destination, amount })
        .expect(201)

      expect(response.body).toEqual({ destination: { id: destination, balance: Number(amount) } })
    })

    and(/^I make a new deposit of (\d+) \$ebx in account (\d+), totaling (\d+) \$ebx$/, async (amount, destination, balance) => {
      const response = await request(app)
        .post('/event')
        .send({ type: 'deposit', destination, amount })
        .expect(201)

      expect(response.body).toEqual({ destination: { id: destination, balance: Number(balance) } })
    })

    then(/^Account (\d+) must have (\d+) \$ebx$/, async (destination, amount) => {
      const response = await request(app)
        .get('/balance')
        .query({ account_id: destination })
        .expect(200)

      expect(response.text).toBe(amount)
    })
  })
})
