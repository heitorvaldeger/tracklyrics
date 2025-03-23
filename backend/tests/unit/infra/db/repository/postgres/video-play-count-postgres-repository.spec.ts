import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import _ from 'lodash'

import { VideoPlayCountPostgresRepository } from '#infra/db/repository/postgres/video-play-count-postgres-repository'
import { VideoPlayCount } from '#models/video-play-count'
import { mockAllTables } from '#tests/__mocks__/db/mock-all'
import { toCamelCase } from '#utils/index'

const makeSut = async () => {
  const { fakeVideo } = await mockAllTables()
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
