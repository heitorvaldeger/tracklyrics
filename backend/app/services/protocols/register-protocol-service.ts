import { UserEmailStatus } from '#enums/user-email-status'
import { IMethodResponse } from '#helpers/types/IMethodResponse'

export abstract class RegisterProtocolService {
  abstract register(
    payload: RegisterProtocolService.Params
  ): Promise<IMethodResponse<RegisterProtocolService.UserRegisterModel>>
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
