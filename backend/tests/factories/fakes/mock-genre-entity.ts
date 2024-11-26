import GenreLucid from '#models/genre-model/genre-lucid'
import { faker } from '@faker-js/faker'

export const mockGenreEntity = async (): Promise<GenreLucid> => {
  return await GenreLucid.create({
    name: faker.lorem.words(2),
  })
}
