import { ApplicationError } from '#helpers/types/application-error'

export type MethodResponse<T> = {
  isSuccess: boolean
  error?: ApplicationError
  value?: T
}
