import { faker } from '@faker-js/faker'

import { Language } from '#models/language'

export const mockLanguage = async () => {
  const language = (
    await Language.create({
      name: faker.lorem.words(2),
      flagCountry: faker.string.alpha({
        length: 2,
      }),
    })
  ).serialize() as Language

  return language
}
