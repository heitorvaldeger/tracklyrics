import { faker } from '@faker-js/faker'

import { RegisterProtocolService } from '#services/protocols/register-protocol-service'

export const mockRegisterRequest = (): RegisterProtocolService.Params => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})
