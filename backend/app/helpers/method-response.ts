import { ApplicationError } from '#helpers/types/ApplicationError'
import { IMethodResponse } from './types/IMethodResponse.js'

export function createSuccessResponse<T>(value?: T): IMethodResponse<T> {
  return { isSuccess: true, value }
}

export function createFailureResponse<T>(error: ApplicationError): IMethodResponse<T> {
  return { isSuccess: false, error }
}
