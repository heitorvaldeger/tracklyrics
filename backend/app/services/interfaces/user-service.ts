import { UserWithoutPassword } from '#infra/db/repository/interfaces/user-repository'

export abstract class IUserService {
  abstract getFullInfoByUserLogged(): Promise<UserWithoutPassword>
}
