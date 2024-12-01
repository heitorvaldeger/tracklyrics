import { badRequest, notFound, serverError, ok, unprocessable, forbidden } from '#helpers/http'
import { errors } from '@vinejs/vine'
import { HttpStatusCode } from '../enums/HttpStatusCode.js'
import { IMethodResponse } from './types/IMethodResponse.js'

export const dispatch = ({ isSuccess, error, value }: IMethodResponse<any>) => {
  if (isSuccess) {
    if (value) {
      return ok(value)
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
    case HttpStatusCode.FORBIDDEN:
      return forbidden(error)
    default:
      return serverError(error)
  }
}
