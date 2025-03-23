import { HttpContext, ResponseStatus } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */
export default class ServerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, containerResolver, logger, response } = ctx
    const token = request.cookie('AUTH', '')
    const headers = request.headers()

    headers.accept = 'application/json'
    headers.authorization = `Bearer ${token}`

    containerResolver.bindValue(HttpContext, ctx)
    containerResolver.bindValue(Logger, logger)

    await next()
  }
}
