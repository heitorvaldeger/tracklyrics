import { UserEmailStatus } from '#enums/user-email-status'
import { IUserRepository } from '#infra/db/repository/interfaces/user-repository'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'
import { IUserService } from '#services/interfaces/user-service'

export const mockUserWithoutPasswordData: UserWithoutPasswordModel = {
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
  getUserByEmailOrUsername: (payload: IUserRepository.FindUserByEmailUsernameParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      emailStatus: UserEmailStatus.VERIFIED,
    }),
  getUserByEmailWithoutPassword: (emailAddress: string) =>
    Promise.resolve(mockUserWithoutPasswordData),
  create: (user: IUserRepository.CreateParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      username: 'any_username',
      email: 'any_email',
      password: 'any_password',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }),
  createAccessToken: (userUuid: string) =>
    Promise.resolve({
      type: 'any_type',
      token: 'any_token',
      expiresAt: new Date(2000, 0, 1),
    }),
  deleteAllAccessToken: (userUuid: string) => Promise.resolve(),
  updateEmailStatus: (userUuid: string) => Promise.resolve(),
}
