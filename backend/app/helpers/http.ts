import { IHttpResponse } from './interfaces/IHttpResponse.js'

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

export const serverError = (error: any): IHttpResponse => ({
  statusCode: 500,
  body: error,
})

export const notFound = (body: any): IHttpResponse => ({
  statusCode: 404,
  body,
})

export const unprocessable = (body: any): IHttpResponse => ({
  statusCode: 422,
  body,
})
