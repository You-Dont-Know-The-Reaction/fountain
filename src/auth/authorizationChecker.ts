import { Action } from 'routing-controllers'

import { Repository } from 'typeorm'
import { UserRepository } from '../api/repositories/UserRepository'
import { Logger } from '../lib/logger'
import { AuthService } from './AuthService'

export function authorizationChecker(): (
  action: Action,
  roles: any[],
) => Promise<boolean> | boolean {
  const log = new Logger(__filename)
  const authService = new AuthService(new Logger(__filename), new UserRepository(new Repository()))

  return async function innerAuthorizationChecker(
    action: Action,
    roles: string[],
  ): Promise<boolean> {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    console.log(action.request.route.path)
    if (action.request.route.path !== '/api/users' && action.request.route.method !== 'post') {
      const credentials = authService.parseBasicAuthFromRequest(action.request)

      if (credentials === undefined) {
        log.warn('REQUEST => ', action.request.route)
        log.warn('No credentials given')
        return false
      }

      action.request.user = await authService.validateUser(
        credentials.username,
        credentials.password,
      )
      if (action.request.user === undefined) {
        log.warn('Invalid credentials given')
        return false
      }
    }

    log.info('Successfully checked credentials')
    return true
  }
}
