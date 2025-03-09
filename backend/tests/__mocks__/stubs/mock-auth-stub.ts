import { faker } from '@faker-js/faker'

import { UserEmailStatus } from '#enums/user-email-status'
import { createSuccessResponse } from '#helpers/method-response'
import { AuthProtocolService } from '#services/_protocols/auth-protocol-service'

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

export const mockAuthServiceStub = (): AuthProtocolService => ({
  register: (params: AuthProtocolService.RegisterParams) =>
    Promise.resolve(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.UNVERIFIED,
      })
    ),
  login: (params: AuthProtocolService.LoginParams) =>
    Promise.resolve(
      createSuccessResponse({
        type: 'any_type',
        token: 'any_token',
      })
    ),
  validateEmail: (params: AuthProtocolService.ValidateEmailParams) =>
    Promise.resolve(
      createSuccessResponse({
        uuid: 'any_uuid',
        emailStatus: UserEmailStatus.VERIFIED,
      })
    ),
})
