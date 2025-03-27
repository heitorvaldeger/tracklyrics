import { faker } from '@faker-js/faker'

import { UserEmailStatus } from '#enums/user-email-status'
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

export const mockAuthService: AuthProtocolService = {
  register: (params: AuthProtocolService.RegisterParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.UNVERIFIED,
    }),
  login: (params: AuthProtocolService.LoginParams) =>
    Promise.resolve({
      type: 'any_type',
      token: 'any_token',
      expiresAt: new Date(2000, 0, 1),
    }),
  validateEmail: (params: AuthProtocolService.ValidateEmailParams) =>
    Promise.resolve({
      uuid: 'any_uuid',
      emailStatus: UserEmailStatus.VERIFIED,
    }),
}
