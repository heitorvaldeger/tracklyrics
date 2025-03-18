import { errors } from '@adonisjs/auth'
import type { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { NextFn } from '@adonisjs/core/types/http'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { HTTP_STATUS_CODE } from '#constants/http-status-code'
import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/protocols/auth'

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
      app.container.bind(Auth, async () => {
        return new AuthAdonis(ctx.auth)
      })
      return next()
    } catch (error) {
      if (error instanceof errors.E_UNAUTHORIZED_ACCESS) {
        return ctx.response
          .status(HTTP_STATUS_CODE.UNAUTHORIZED)
          .send(APPLICATION_MESSAGES.UNAUTHORIZED)
      }
    }
  }
}
