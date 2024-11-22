import { HttpContextFactory } from '@adonisjs/core/factories/http'

export const makeHttpRequest = (body?: any, params?: any) => {
  const httpContext = new HttpContextFactory().create()
  httpContext.request.updateBody(body)
  httpContext.params = params

  return httpContext
}
