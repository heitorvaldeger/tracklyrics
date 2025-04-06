import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/interfaces/auth'
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

  return {
    authStub,
    uuid,
  }
}
