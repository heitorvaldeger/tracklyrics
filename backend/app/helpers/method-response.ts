import { ApplicationError } from '#helpers/types/application-error'

import { MethodResponse } from './types/method-response.js'

export function createSuccessResponse<T>(value?: T): MethodResponse<T> {
  return { isSuccess: true, value }
}

export function createFailureResponse<T>(error: ApplicationError): MethodResponse<T> {
  return { isSuccess: false, error }
}
