import Language from '#models/language'

export const makeFakeLanguage = async () => {
  const language = await Language.create({
    name: 'any_name',
  })

  return language
}
