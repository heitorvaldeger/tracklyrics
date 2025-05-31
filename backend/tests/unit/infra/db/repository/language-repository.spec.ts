import { test } from '@japa/runner'
import _ from 'lodash'

import { LanguagePostgresRepository } from '#core/infra/db/repository/language-repository'
import { mockLanguage } from '#tests/__mocks__/db/mock-language'

const makeSut = () => {
  const sut = new LanguagePostgresRepository()
  return { sut }
}

test.group('LanguagePostgresRepository', (group) => {
  test('it must returns a list of languages with on success', async ({ expect }) => {
    const fakeLanguage = await mockLanguage()
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([fakeLanguage])
  })

  test('it must return a language if language id exists', async ({ expect }) => {
    const fakeLanguage = await mockLanguage()
    const { sut } = makeSut()

    const language = await sut.findById(fakeLanguage.id)

    expect(language).toEqual(fakeLanguage)
  })

  test('it must return null if language id not exists', async ({ expect }) => {
    const { sut } = makeSut()

    const language = await sut.findById(-1)

    expect(language).toBeFalsy()
  })
})
