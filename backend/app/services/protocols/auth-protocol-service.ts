export abstract class AuthProtocolService {
  abstract login(params: AuthProtocolService.LoginParams): any
}

export namespace AuthProtocolService {
  export type LoginParams = {
    email: string
    password: string
  }
}
