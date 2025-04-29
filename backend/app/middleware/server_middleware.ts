import { HttpContext, ResponseStatus } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import app from '@adonisjs/core/services/app'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/interfaces/auth'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */
export default class ServerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, containerResolver, logger } = ctx
    const headers = request.headers()

    headers.accept = 'application/json'

    containerResolver.bindValue(HttpContext, ctx)
    containerResolver.bindValue(Logger, logger)

    app.container.bind(Auth, async () => {
      await ctx.auth.check()
      return new AuthAdonis(ctx.auth)
    })

    await next()
  }
}
