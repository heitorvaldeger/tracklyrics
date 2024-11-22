import { ApplicationError } from '#helpers/types/ApplicationError'

export interface IMethodResponse<T> {
  isSuccess: boolean
  error?: ApplicationError
  value?: T
}
