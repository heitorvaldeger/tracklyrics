import _ from 'lodash'
import { test } from '@japa/runner'
import { LanguagePostgresRepository } from '#repository/postgres-repository/language-postgres-repository'
import { mockLanguageEntity } from '#tests/factories/fakes/index'

const makeSut = () => {
  const sut = new LanguagePostgresRepository()
  return { sut }
}

test.group('LanguagePostgresRepository', (group) => {
  test('should returns a list of languages with on success', async ({ expect }) => {
    const fakeLanguage = (await mockLanguageEntity()).serialize()
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([fakeLanguage])
  })

  test('should return a language if language id exists', async ({ expect }) => {
    const fakeLanguage = await mockLanguageEntity()
    const { sut } = makeSut()

    const language = await sut.findById(fakeLanguage.id)

    expect(language).toEqual(fakeLanguage.serialize())
  })

  test('should return null if language id not exists', async ({ expect }) => {
    const { sut } = makeSut()

    const language = await sut.findById(-1)

    expect(language).toBeFalsy()
  })
})
