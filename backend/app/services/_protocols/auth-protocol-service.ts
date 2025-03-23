import { UserEmailStatus } from '#enums/user-email-status'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

export abstract class AuthProtocolService {
  abstract login(params: AuthProtocolService.LoginParams): Promise<UserAccessTokenModel>
  abstract register(
    payload: AuthProtocolService.RegisterParams
  ): Promise<AuthProtocolService.UserRegisterModel>
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
