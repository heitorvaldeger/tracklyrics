import { LanguageLucid } from '#models/language-model/language-lucid'

export const mockFakeLanguage = async () => {
  const language = await LanguageLucid.create({
    name: 'any_name',
  })

  return language
}
