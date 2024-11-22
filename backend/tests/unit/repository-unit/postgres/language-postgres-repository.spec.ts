import _ from 'lodash'
import { test } from '@japa/runner'
import { LanguagePostgresRepository } from '#repository/postgres-repository/language-postgres-repository'
import { LanguageLucid } from '#models/language-model/language-lucid'
import VideoLucid from '#models/video-model/video-lucid'
import { mockFakeLanguage } from '#tests/factories/fakes/index'

const makeSut = () => {
  const sut = new LanguagePostgresRepository()
  return { sut }
}

test.group('LanguagePostgresRepository.findAll', (group) => {
  group.each.setup(async () => {
    await VideoLucid.query().delete()
    await LanguageLucid.query().delete()
  })

  test('should returns a list of languages with on success', async ({ expect }) => {
    const fakeLanguage = (await mockFakeLanguage()).serialize()
    const { sut } = makeSut()

    const languages = await sut.findAll()

    expect(languages).toEqual([fakeLanguage])
  })
})
