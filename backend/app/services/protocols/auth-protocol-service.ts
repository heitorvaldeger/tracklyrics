export abstract class AuthProtocolService {
  abstract login(params: AuthProtocolService.LoginParams): any
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
