import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import _ from 'lodash'

import { VideoPlayCountPostgresRepository } from '#infra/db/repository/postgres/video-play-count-postgres-repository'
import { VideoPlayCount } from '#models/video-play-count'
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
  const sut = new VideoPlayCountPostgresRepository()

  return { sut, fakeVideo }
}

test.group('VideoPlayCountPostgresRepository', (group) => {
  test('it must increment play on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)

    const videoPlayCount = toCamelCase(
      await db
        .from('video_play_counts')
        .where('video_id', fakeVideo.id)
        .select(['video_id', 'play_count'])
        .first()
    ) as VideoPlayCount

    expect(videoPlayCount?.playCount).toBe(3)
    expect(videoPlayCount?.videoId).toBe(fakeVideo.id)
  })
})
