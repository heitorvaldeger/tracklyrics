import { errors } from '@vinejs/vine'

import { HttpStatusCode } from '#enums/http-status-code'
import {
  badRequest,
  notContent,
  notFound,
  ok,
  serverError,
  unauthorized,
  unprocessable,
} from '#helpers/http'

import { MethodResponse } from './types/method-response.js'

export const dispatch = ({ isSuccess, error, value }: MethodResponse<any>) => {
  if (isSuccess) {
    if (value) {
      return ok(value)
    } else {
      return notContent()
    }
  }

  if (error instanceof errors.E_VALIDATION_ERROR) {
    return badRequest(error.messages)
  }

  switch (error?.httpCode) {
    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      return unprocessable(error)
    case HttpStatusCode.NOT_FOUND:
      return notFound(error)
    case HttpStatusCode.UNAUTHORIZED:
      return unauthorized(error)
    default:
      return serverError(error)
  }
}
