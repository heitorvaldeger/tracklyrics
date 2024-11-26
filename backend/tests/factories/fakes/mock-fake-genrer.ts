import GenrerLucid from '#models/genrer-model/genrer-lucid'
import { faker } from '@faker-js/faker'

export const mockFakeGenrer = async (): Promise<GenrerLucid> => {
  return await GenrerLucid.create({
    name: faker.lorem.words(2),
  })
}
