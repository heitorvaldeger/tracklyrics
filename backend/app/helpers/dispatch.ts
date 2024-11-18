import { badRequest, noContent, notFound, serverError, ok, unprocessable } from '#helpers/http'
import { HttpStatusCode } from '../enums/HttpStatusCode.js'
import { IMethodResponse } from './interfaces/IMethodResponse.js'

export const dispatch = (response: IMethodResponse<any>) => {
  if (response.isSuccess) {
    if (response.value) {
      return ok(response.value)
    } else {
      return noContent()
    }
  }

  switch (response.error?.httpCode) {
    case HttpStatusCode.BAD_REQUEST:
      return badRequest(response.error.message)
    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      return unprocessable(response.error.message)
    case HttpStatusCode.NOT_FOUND:
      return notFound(response.error.message)
    default:
      return serverError(new Error(response.error?.message))
  }
}
