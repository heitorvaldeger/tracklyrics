import { HttpContextFactory } from '@adonisjs/core/factories/http'

export const makeHttpRequestBody = (body: any) => {
  const httpContext = new HttpContextFactory().create()
  httpContext.request.updateBody(body)

  return httpContext
}
