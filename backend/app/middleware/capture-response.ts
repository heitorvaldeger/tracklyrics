import { type HttpContext, ResponseStatus } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */
export default class CaptureResponseMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const headers = request.headers()
    headers.accept = 'application/json'

    await next()

    const { statusCode, body } = response.getBody()

    if (statusCode) {
      if (statusCode === ResponseStatus.InternalServerError) {
        response.status(statusCode).json({
          message: body.message,
          stack: body.stack,
        })
      } else {
        if (request.url()?.includes('/login') && statusCode === ResponseStatus.Ok) {
          response.status(statusCode).cookie('AUTH', body.token).json(body)
        } else {
          response.status(statusCode).json(body)
        }
      }
    }
  }
}
