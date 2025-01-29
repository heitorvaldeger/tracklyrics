import { faker } from '@faker-js/faker'

export const mockRegisterRequest = (): {
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
