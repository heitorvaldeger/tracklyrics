import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import _ from 'lodash'

import { PlayPostgresRepository } from '#infra/db/repository/play-repository'
import Play from '#models/play'
import { mockVideo } from '#tests/__mocks__/db/mock-all'
import { mockGenre } from '#tests/__mocks__/db/mock-genre'
import { mockLanguage } from '#tests/__mocks__/db/mock-language'
import { mockUser } from '#tests/__mocks__/db/mock-user'
import { toCamelCase } from '#utils/index'

const createData = async () => {
  const [fakeLanguage, fakeGenre, fakeUser] = await Promise.all([
    mockLanguage(),
    mockGenre(),
    mockUser(),
  ])
  const fakeVideo = await mockVideo({ fakeLanguage, fakeGenre, fakeUser })

  return { fakeVideo, fakeUser, fakeLanguage, fakeGenre }
}

const makeSut = async () => {
  const { fakeVideo } = await createData()
  const sut = new PlayPostgresRepository()

  return { sut, fakeVideo }
}

test.group('PlayPostgresRepository', (group) => {
  test('it must increment play on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)

    const plays = await Play.findBy('videoId', fakeVideo.id)

    expect(plays?.playCount).toBe(3)
    expect(plays?.videoId).toBe(fakeVideo.id)
  })
})
