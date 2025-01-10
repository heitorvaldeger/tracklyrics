import { HttpResponse } from './types/http-response.js'

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
})

export const notContent = (): HttpResponse => ({
  statusCode: 204,
})

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body,
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

export const forbidden = (body: any): HttpResponse => ({
  statusCode: 401,
  body,
})
