import { UserWithoutPassword } from '#core/infra/db/repository/interfaces/user-repository'

export abstract class IUserService {
  abstract getFullInfoByUserLogged(): Promise<UserWithoutPassword>
  abstract updatePassword(newPassword: string): Promise<void>
  abstract validateUpdatePassword(codeOTP: string): Promise<void>
}
