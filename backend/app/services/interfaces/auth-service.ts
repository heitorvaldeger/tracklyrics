import { UserEmailStatus } from '#enums/user-email-status'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

export abstract class IAuthService {
  abstract login(params: IAuthService.LoginParams): Promise<UserAccessTokenModel>
  abstract register(payload: IAuthService.RegisterParams): Promise<IAuthService.UserRegisterModel>
  abstract validateEmail(params: IAuthService.ValidateEmailParams): any
}

export namespace IAuthService {
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
