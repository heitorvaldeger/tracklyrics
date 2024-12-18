import type { HttpContext } from '@adonisjs/core/http'
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
      if (statusCode === 500) {
        response.status(statusCode).json({
          message: body.message,
          stack: body.stack,
        })
      } else {
        response.status(statusCode).json(body)
      }
    }
  }
}
