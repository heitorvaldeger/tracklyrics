import _ from 'lodash'
import { test } from '@japa/runner'
import { LanguagePostgresRepository } from '#repository/postgres/language-postgres-repository'
import { makeFakeLanguage } from '#tests/factories/fakes/makeFakeLanguage'
import Video from '#models/video/video-lucid'
import Language from '#models/lucid-orm/language'
import VideoLucid from '#models/video/video-lucid'

const makeSut = () => {
  const sut = new LanguagePostgresRepository()
  return { sut }
}

test.group('LanguagePostgresRepository.findAll', (group) => {
  group.setup(async () => {
    await VideoLucid.query().whereNotNull('id').delete()
    await Language.query().whereNotNull('id').delete()
  })

  test('should returns a list of languages with on success', async ({ expect }) => {
    const fakeLanguage = (await makeFakeLanguage()).serialize()
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([fakeLanguage])
  })
})
