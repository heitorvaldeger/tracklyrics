import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'
import { UserAccessTokenModel } from '#models/user-model/user-access-token-model'

export abstract class AuthProtocolService {
  abstract login(
    params: AuthProtocolService.LoginParams
  ): Promise<MethodResponse<UserAccessTokenModel | ApplicationError>>
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
}
