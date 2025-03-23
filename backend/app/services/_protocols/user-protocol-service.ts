import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

export abstract class UserProtocolService {
  abstract getFullInfoByUserLogged(): Promise<UserWithoutPasswordModel>
}
