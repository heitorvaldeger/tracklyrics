import { RegisterProtocolService } from '#services/protocols/register-protocol-service'
import { faker } from '@faker-js/faker'

export const mockUserRegisterRequest = (): RegisterProtocolService.Params => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})
