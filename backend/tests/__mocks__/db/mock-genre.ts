import { faker } from '@faker-js/faker'

import { Genre } from '#models/genre'

export const mockGenre = async (): Promise<Genre> => {
  const genre = await Genre.create({
    name: faker.lorem.words(2),
  })

  return genre.serialize() as Genre
}
