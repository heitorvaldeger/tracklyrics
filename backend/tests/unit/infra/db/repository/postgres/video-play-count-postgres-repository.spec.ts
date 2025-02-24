import { test } from '@japa/runner'
import _ from 'lodash'

import { VideoPlayCountPostgresRepository } from '#infra/db/repository/postgres/video-play-count-postgres-repository'
import VideoPlayCountLucid from '#models/video-play-count/video-play-count-lucid'
import { mockLucidEntity } from '#tests/__mocks__/entities/mock-lucid-entity'

const makeSut = async () => {
  const { fakeVideo } = await mockLucidEntity()
  const sut = new VideoPlayCountPostgresRepository()

  return { sut, fakeVideo }
}

test.group('VideoPlayCountPostgresRepository', (group) => {
  test('it must increment play on success', async ({ expect }) => {
    const { sut, fakeVideo } = await makeSut()
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)
    await sut.increment(fakeVideo.id)

    const video = await VideoPlayCountLucid.query()
      .where('video_id', fakeVideo.id)
      .select(['video_id', 'play_count'])
      .first()

    expect(video?.playCount).toBe(3)
    expect(video?.videoId).toBe(fakeVideo.id)
  })
})
