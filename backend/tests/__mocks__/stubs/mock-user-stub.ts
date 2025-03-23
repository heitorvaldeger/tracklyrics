import { UserEmailStatus } from '#enums/user-email-status'
import { UserRepository } from '#infra/db/repository/_protocols/user-repository'
import { UserWithoutPasswordModel } from '#models/user-model/user-without-password-model'
import { UserProtocolService } from '#services/_protocols/user-protocol-service'

export const mockUserWithoutPasswordData: UserWithoutPasswordModel = {
  uuid: 'any_uuid',
  username: 'any_username',
  email: 'any_email',
  emailStatus: UserEmailStatus.VERIFIED,
  firstName: 'any_firstname',
  lastName: 'any_lastname',
}

export const mockUserServiceStub = (): UserProtocolService => ({
  getFullInfoByUserLogged: () => Promise.resolve(mockUserWithoutPasswordData),
})

export const mockUserRepositoryStub = () => {
  const userRepositoryStub: UserRepository = {
    getUserByEmailOrUsername: (payload: UserRepository.FindUserByEmailUsernameParams) =>
      Promise.resolve({
        uuid: 'any_uuid',
        username: 'any_username',
        email: 'any_email',
        password: 'any_password',
        emailStatus: UserEmailStatus.VERIFIED,
      }),
    getUserByEmailWithoutPassword: (emailAddress: string) =>
      Promise.resolve(mockUserWithoutPasswordData),
    create: (user: UserRepository.CreateParams) =>
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

  return userRepositoryStub
}
