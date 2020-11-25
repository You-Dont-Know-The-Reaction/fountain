import 'reflect-metadata'
import { useContainer as classValidatorUseContainer } from 'class-validator'
import { Application } from 'express'
import glob from 'glob'
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { createConnection, getConnectionOptions, useContainer as ormUseContainer } from 'typeorm'
import { configure, format, transports } from 'winston'

import { authorizationChecker } from './auth/authorizationChecker'
import { currentUserChecker } from './auth/currentUserChecker'
import env from './env'
import { banner } from './lib/banner'
import { Logger } from './lib/logger'

// winstonLoader
configure({
  transports: [
    new transports.Console({
      level: env.log.level,
      handleExceptions: true,
      format: env.node !== 'development'
        ? format.combine(
          format.json()
        )
        : format.combine(
          format.colorize(),
          format.simple()
        ),
    }),
  ],
})

/**
 * eventDispatchLoader
 * ------------------------------
 * This loads all the created subscribers into the project, so we do not have to
 * import them manually
 */
env.app.dirs.subscribers.forEach((pattern) => {
  glob(pattern, (_: any, files: string[]) => {
    for (const file of files) {
      require(file)
    }
  })
});

(async () => {
  const loadedConnectionOptions = await getConnectionOptions()

  const connectionOptions = Object.assign(loadedConnectionOptions, {
    type: env.db.type as any, // See createConnection options for valid types
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    entities: env.app.dirs.entities,
    migrations: env.app.dirs.migrations,
  })

  const conn = await createConnection(connectionOptions)

  if (conn.isConnected) {
    console.log('Connected to DB.')
  } else {
    console.log('Error in establishing connection to DB.')
  }

  routingUseContainer(Container)
  ormUseContainer(Container)
  classValidatorUseContainer(Container)
})()

const expressApp: Application = createExpressServer({
  cors: true,
  classTransformer: true,
  routePrefix: env.app.routePrefix,
  defaultErrorHandler: false,
  /**
   * We can add options about how routing-controllers should configure itself.
   * Here we specify what controllers should be registered in our express server.
   */
  controllers: env.app.dirs.controllers,
  middlewares: env.app.dirs.middlewares,
  interceptors: env.app.dirs.interceptors,

  /**
   * Authorization features
   */
  authorizationChecker: authorizationChecker(),
  currentUserChecker: currentUserChecker(),
})

expressApp.listen(env.app.port)

banner(new Logger(__filename))
