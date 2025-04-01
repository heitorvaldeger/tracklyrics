import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'

export abstract class IUserService {
  abstract getFullInfoByUserLogged(): Promise<UserWithoutPasswordModel>
}
