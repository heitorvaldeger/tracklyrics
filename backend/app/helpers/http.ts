import { HttpResponse } from './types/HttpResponse.js'

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
})

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body,
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
})

export const serverError = (error: any): HttpResponse => ({
  statusCode: 500,
  body: error,
})

export const notFound = (body: any): HttpResponse => ({
  statusCode: 404,
  body,
})

export const unprocessable = (body: any): HttpResponse => ({
  statusCode: 422,
  body,
})
