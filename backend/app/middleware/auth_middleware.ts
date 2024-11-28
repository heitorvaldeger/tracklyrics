import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { AuthService } from '#services/auth/auth-service'
import { inject } from '@adonisjs/core'
import { AuthAdonisStrategy } from '#services/auth/strategy/auth-adonis-strategy'
import { AuthStrategy } from '#services/auth/strategy/auth-strategy'
import app from '@adonisjs/core/services/app'

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
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    app.container.bind(AuthStrategy, async () => {
      return new AuthAdonisStrategy(ctx.auth)
    })
    return next()
  }
}
