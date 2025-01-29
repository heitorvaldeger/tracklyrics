import { faker } from '@faker-js/faker'

import GenreLucid from '#models/genre-model/genre-lucid'

export const mockGenreEntity = async (): Promise<GenreLucid> => {
  return await GenreLucid.create({
    name: faker.lorem.words(2),
  })
}
