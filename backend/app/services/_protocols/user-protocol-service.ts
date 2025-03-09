import { MethodResponse } from '#helpers/types/method-response'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

export abstract class UserProtocolService {
  abstract getFullInfoByUserLogged(): Promise<MethodResponse<UserWithoutPasswordModel>>
}
