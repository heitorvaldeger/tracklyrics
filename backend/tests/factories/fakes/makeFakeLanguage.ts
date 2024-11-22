import Language from '#models/lucid-orm/language'

export const makeFakeLanguage = async () => {
  const language = await Language.create({
    name: 'any_name',
  })

  return language
}
