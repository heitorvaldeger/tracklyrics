import { faker } from '@faker-js/faker'

import { UserEmailStatus } from '#enums/user-email-status'
import {
  EmailUsername,
  IUserRepository,
  UserWithoutPassword,
} from '#infra/db/repository/interfaces/user-repository'
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
}
