import { IApplicationError } from '#helpers/interfaces/IApplicationError'
import { IMethodResponse } from './interfaces/IMethodResponse.js'

export function createSuccessResponse<T>(value?: T): IMethodResponse<T> {
  return { isSuccess: true, value }
}

export function createFailureResponse<T>(error: IApplicationError): IMethodResponse<T> {
  return { isSuccess: false, error }
}
