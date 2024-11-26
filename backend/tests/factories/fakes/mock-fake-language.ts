import { LanguageLucid } from '#models/language-model/language-lucid'
import { faker } from '@faker-js/faker'

export const mockFakeLanguage = async () => {
  const language = await LanguageLucid.create({
    name: faker.lorem.words(2),
  })

  return language
}
