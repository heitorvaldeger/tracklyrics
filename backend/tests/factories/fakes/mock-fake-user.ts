import { faker } from '@faker-js/faker'
import UserLucid from '#models/user-model/user-lucid'

export const mockFakeUser = async (email?: string, username?: string) => {
  const genrer = await UserLucid.create({
    email: email ?? faker.internet.email(),
    username: username ?? faker.internet.username(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    uuid: faker.string.uuid(),
  })

  return genrer
}
