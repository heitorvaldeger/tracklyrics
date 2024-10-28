import { IApplicationError } from '#helpers/interfaces/IApplicationError'

export interface IMethodResponse<T> {
  isSuccess: boolean
  error?: IApplicationError
  value?: T
}
