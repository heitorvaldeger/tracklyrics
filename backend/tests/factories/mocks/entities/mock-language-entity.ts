import { faker } from '@faker-js/faker'

import { LanguageLucid } from '#models/language-model/language-lucid'

export const mockLanguageEntity = async () => {
  return await LanguageLucid.create({
    name: faker.lorem.words(2),
  })
}
