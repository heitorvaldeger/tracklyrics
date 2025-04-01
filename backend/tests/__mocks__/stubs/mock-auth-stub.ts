import { faker } from '@faker-js/faker'
import { createStubInstance, SinonStubbedInstance } from 'sinon'

import { UserEmailStatus } from '#enums/user-email-status'
import { AuthAdonis } from '#infra/auth/auth-adonis'
import { Auth } from '#infra/auth/interfaces/auth'
import { IAuthService } from '#services/interfaces/auth-service'

export const mockAuthRegisterData = (): {
  email: string
  username: string
  password: string
  password_confirmation: string
  firstName: string
  lastName: string
} => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    password,
    password_confirmation: password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}

export const mockAuthService: IAuthService = {
  register: (_: IAuthService.RegisterParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }),
  login: (_: IAuthService.LoginParams) =>
    Promise.resolve({
      type: 'any_type',
      token: 'any_token',
      expiresAt: new Date(2000, 0, 1),
    }),
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
