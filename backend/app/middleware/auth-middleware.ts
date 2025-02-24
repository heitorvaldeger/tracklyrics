import { errors } from '@adonisjs/auth'
import type { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { NextFn } from '@adonisjs/core/types/http'

import { HttpStatusCode } from '#enums/http-status-code'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
@inject()
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards)
      app.container.bind(AuthStrategy, async () => {
        return new AuthAdonisStrategy(ctx.auth)
      })
      return next()
    } catch (error) {
      if (error instanceof errors.E_UNAUTHORIZED_ACCESS) {
        return ctx.response
          .status(HttpStatusCode.UNAUTHORIZED)
          .send(APPLICATION_MESSAGES.UNAUTHORIZED)
      }
      // console.log(error)
      // return next()
    }
  }
}
