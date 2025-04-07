import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/interfaces/auth'
import { UserBasic } from '#infra/db/repository/interfaces/user-repository'
import { IAuthService } from '#services/interfaces/auth-service'

export const mockAuthService: IAuthService = {
  register: (_: IAuthService.RegisterParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }),
  login: (_: IAuthService.LoginParams) => Promise.resolve(),
  validateEmail: (_: IAuthService.ValidateEmailParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.VERIFIED,
    }),
}

type AuthStub = {
  authStub: SinonStubbedInstance<Auth>
  uuid: string
}
export const mockAuth = (): AuthStub => {
  const uuid = faker.string.uuid()
  const authStub = createStubInstance(AuthAdonis)
  authStub.getUserId.returns(1)
  authStub.getUserEmail.returns('valid_email@mail.com')
  authStub.getUserUuid.returns(faker.string.uuid())
  authStub.getUser.returns({
    email: 'any_email@mail.com',
    emailStatus: 'UNVERIFIED',
    firstName: 'any_firstname',
    lastName: 'any_lastname',
    password: 'any_password',
    username: 'any_username',
    uuid: 'any_uuid',
  } as UserBasic)

  return {
    authStub,
    uuid,
  }
}
