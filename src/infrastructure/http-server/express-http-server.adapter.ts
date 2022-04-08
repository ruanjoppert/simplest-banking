import express from 'express'
import glob from 'glob'
import path from 'path'
import { Application } from '../../application/application'

export const httpServer = (application: Application, routerPattern = '**/*http-route.[tj]s') => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const files = glob.sync(routerPattern)

  for (const fileName of files) {
    const file = path.resolve(process.cwd(), fileName)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const routeFn = require(file)

    if (routeFn?.default instanceof Function) {
      routeFn.default(app, application)
    }
  }

  app.get('/health-check', (req, res) => res.sendStatus(200))

  app.post('/reset', (req, res) => {
    res.status(200).send('OK')

    // process.exit(1)
  })

  return app
}
