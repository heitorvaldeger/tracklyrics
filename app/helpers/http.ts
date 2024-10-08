import { IHttpResponse } from '../contracts/IHttpResponse.js'

export const ok = (body: any): IHttpResponse => ({
  statusCode: 200,
  body,
})
