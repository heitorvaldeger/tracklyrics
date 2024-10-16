import { IHttpResponse } from './contracts/IHttpResponse.js'

export const ok = (body: any): IHttpResponse => ({
  statusCode: 200,
  body,
})

export const badRequest = (body: any): IHttpResponse => ({
  statusCode: 400,
  body,
})

export const noContent = (): IHttpResponse => ({
  statusCode: 204,
})
