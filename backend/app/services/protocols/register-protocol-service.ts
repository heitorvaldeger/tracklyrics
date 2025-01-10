import { UserEmailStatus } from '#enums/user-email-status'
import { MethodResponse } from '#helpers/types/method-response'

export abstract class RegisterProtocolService {
  abstract register(
    payload: RegisterProtocolService.Params
  ): Promise<MethodResponse<RegisterProtocolService.UserRegisterModel>>
}

export namespace RegisterProtocolService {
  export type Params = {
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
}
