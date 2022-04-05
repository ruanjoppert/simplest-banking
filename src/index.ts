import { Application } from './application/application'
import { InMemoryStateStore } from './infrastructure/database/in-memory-state-store.adapter'
import { httpServer } from './infrastructure/http-server/express-http-server.adapter'
import { PinoLogger } from './infrastructure/logger/pino-logger.adapter'
import { InMemoryServiceBus } from './infrastructure/service-bus/in-memory-service-bus.adapter'
import { accountModule } from './modules/account/account.module'

const application = new Application({
  logger: new PinoLogger({ level: 'debug' }),
  commandBus: new InMemoryServiceBus(),
  queryBus: new InMemoryServiceBus(),
  eventBus: new InMemoryServiceBus(),
  accountQueryModel: new InMemoryStateStore()
})

accountModule(application)

const app = httpServer(application,
  process.env.NODE_ENV === 'production'
    ? '**/*http-route.js'
    : '**/*http-route.ts'
)

app.listen(3000)

export { app }
