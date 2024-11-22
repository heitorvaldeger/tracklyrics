import UserLucid from '#models/user-model/user-lucid'
import { randomUUID } from 'node:crypto'

export const mockFakeUser = async (email?: string, username?: string) => {
  const genrer = await UserLucid.create({
    email: email ?? 'any_email',
    username: username ?? 'any_username',
    password: 'any_password',
    firstName: 'any_firstName',
    lastName: 'any_lastName',
    uuid: randomUUID(),
  })

  return genrer
}
