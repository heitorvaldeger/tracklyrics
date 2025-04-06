import { faker } from '@faker-js/faker'

import { User } from '#models/user'

export const mockUser = async (email?: string, username?: string, password?: string) => {
  return await User.create({
    email: email ?? faker.internet.email(),
    username: username ?? faker.internet.username(),
    password: password ?? faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    uuid: faker.string.uuid(),
  })
}
