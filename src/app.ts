import 'reflect-metadata'
import { resolve } from 'path'
import { useContainer as classValidatorUseContainer } from 'class-validator'
import { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import glob from 'glob'
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { createConnection, getConnectionOptions, useContainer as ormUseContainer } from 'typeorm'
import { configure, format, transports } from 'winston'
import { buildSchema } from 'type-graphql'

import { authorizationChecker } from './auth/authorizationChecker'
import { currentUserChecker } from './auth/currentUserChecker'
import env from './env'
import { banner } from './lib/banner'
import { Logger } from './lib/logger'
import { UserResolver } from './api/resolvers'
import { getErrorCode, getErrorMessage, handlingErrors } from './lib/graphql'

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
  routingUseContainer(Container)
  ormUseContainer(Container)
  classValidatorUseContainer(Container)
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

(async () => {
  if (env.graphql.enabled) {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      container: Container,
      // automatically create `schema.gql` file with schema definition in current folder
      emitSchemaFile: resolve(__dirname, '../api', 'schema.gql'),
    })

    handlingErrors(schema)

    expressApp.use(env.graphql.route, (request: any, response: any) => {
      // Build GraphQLContext
      const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
      const container = Container.of(requestId); // get scoped container
      const context = { requestId, container, request, response }; // create our context
      container.set('context', context); // place context or other data in container

      // Setup GraphQL Server
      graphqlHTTP({
        schema,
        context,
        graphiql: env.graphql.editor,
        formatError: error => ({
            code: getErrorCode(error.message),
            message: getErrorMessage(error.message),
            path: error.path,
        }),
      })(request, response)
    })
  }
})()

expressApp.listen(env.app.port)

banner(new Logger(__filename))
