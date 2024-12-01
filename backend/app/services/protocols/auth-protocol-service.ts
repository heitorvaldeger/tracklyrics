export abstract class AuthProtocolService {
  abstract getUserId(): number
  abstract login(params: AuthProtocolService.Params): any
}

export namespace AuthProtocolService {
  export type Params = {
    email: string
    password: string
  }
}
