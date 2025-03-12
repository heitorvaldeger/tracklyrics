import { UserEmailStatus } from '#enums/user-email-status'
import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

export abstract class AuthProtocolService {
  abstract login(
    params: AuthProtocolService.LoginParams
  ): Promise<MethodResponse<UserAccessTokenModel | ApplicationError>>
  abstract register(
    payload: AuthProtocolService.RegisterParams
  ): Promise<MethodResponse<AuthProtocolService.UserRegisterModel>>
  abstract validateEmail(params: AuthProtocolService.ValidateEmailParams): any
}

export namespace AuthProtocolService {
  export type LoginParams = {
    email: string
    password: string
  }

  export type ValidateEmailParams = {
    email: string
    codeOTP: string
  }

  export type RegisterParams = {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
  }
  export type UserRegisterModel = {
    uuid: string
    emailStatus?: UserEmailStatus
  }

  export type IsAuthenticated = {
    isAuthenticated: boolean
  }
}
