import * as dotenv from 'dotenv'
import { join } from 'path'

import * as pkg from '../package.json'

function getOsEnv(key: string): string {
  if (typeof process.env[key] === 'undefined')
    throw new Error(`Environment variable ${key} is not set.`)

  return process.env[key] as string
}

const getOsEnvOptional = (key: string): string | undefined => process.env[key]

const getPath = (path: string): string =>
  (process.env.NODE_ENV === 'production')
    ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
    : join(process.cwd(), path)

const getPaths = (paths: string[]): string[] => paths.map(p => getPath(p))
const getOsPath = (key: string): string => getPath(getOsEnv(key))
const getOsPaths = (key: string): string[] => getPaths(getOsEnvArray(key))

const getOsEnvArray = (key: string, delimiter: string = ','): string[] =>
  process.env[key] && process.env[key].split(delimiter) || []

const toNumber = (value: string): number =>
  parseInt(value, 10)

const toBool = (value: string): boolean =>
  value === 'true'

function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) // named pipe
      return port
    
    if (parsedPort >= 0) // port number
      return parsedPort
    
    return false
}

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) })

/**
 * Environment variables
 */
export default {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
    dirs: {
      migrations: getOsPaths('TYPEORM_MIGRATIONS'),
      migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
      entities: getOsPaths('TYPEORM_ENTITIES'),
      entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
      controllers: getOsPaths('CONTROLLERS'),
      middlewares: getOsPaths('MIDDLEWARES'),
      interceptors: getOsPaths('INTERCEPTORS'),
      subscribers: getOsPaths('SUBSCRIBERS'),
      resolvers: getOsPaths('RESOLVERS'),
    },
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT'),
  },
  db: {
    type: getOsEnv('TYPEORM_CONNECTION'),
    host: getOsEnvOptional('TYPEORM_HOST'),
    port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
    username: getOsEnvOptional('TYPEORM_USERNAME'),
    password: getOsEnvOptional('TYPEORM_PASSWORD'),
    database: getOsEnv('TYPEORM_DATABASE'),
    synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE')),
    logging: getOsEnv('TYPEORM_LOGGING'),
  },
  graphql: {
    enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
    route: getOsEnv('GRAPHQL_ROUTE'),
    editor: toBool(getOsEnv('GRAPHQL_EDITOR')),
  },
  swagger: {
    enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
    route: getOsEnv('SWAGGER_ROUTE'),
    username: getOsEnv('SWAGGER_USERNAME'),
    password: getOsEnv('SWAGGER_PASSWORD'),
  },
  monitor: {
    enabled: toBool(getOsEnv('MONITOR_ENABLED')),
    route: getOsEnv('MONITOR_ROUTE'),
    username: getOsEnv('MONITOR_USERNAME'),
    password: getOsEnv('MONITOR_PASSWORD'),
  },
}
