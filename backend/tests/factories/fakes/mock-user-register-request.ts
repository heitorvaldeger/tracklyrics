import { UserRegisterRequest } from '#params/user-params/user-register-request'
import { faker } from '@faker-js/faker'

export const mockUserRegisterRequest = (): UserRegisterRequest => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})
