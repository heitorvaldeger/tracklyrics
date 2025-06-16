import {
  EmailUsername,
  IUserRepository,
  UserWithoutPassword,
} from '#core/infra/db/repository/interfaces/user-repository'
import { UserEmailStatus } from '#enums/user-email-status'
import { User } from '#models/user'
import { IUserService } from '#services/interfaces/user-service'

export const mockUserWithoutPasswordData: UserWithoutPassword = {
  uuid: 'any_uuid',
  username: 'any_username',
  email: 'any_email',
  emailStatus: UserEmailStatus.VERIFIED,
  firstName: 'any_firstname',
  lastName: 'any_lastname',
}

export const mockUserService: IUserService = {
  getFullInfoByUserLogged: () => Promise.resolve(mockUserWithoutPasswordData),
  updatePassword: (_) => Promise.resolve(),
  validateUpdatePassword: (_) => Promise.resolve(),
}

export const mockUserRepository: IUserRepository = {
  getUserByEmailOrUsername: (_: EmailUsername) =>
    Promise.resolve({
      uuid: 'any_uuid',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_firstname',
      lastName: 'any_lastname',
      emailStatus: UserEmailStatus.VERIFIED,
    }),
  getUserByEmailWithoutPassword: (_: string) => Promise.resolve(mockUserWithoutPasswordData),
  create: (_: User) =>
    Promise.resolve({
      uuid: 'any_uuid',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_firstname',
      lastName: 'any_lastname',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }),

  updateEmailStatus: (_: string) => Promise.resolve(),
  updatePassword: (_: string, __: string) => Promise.resolve(),
}
