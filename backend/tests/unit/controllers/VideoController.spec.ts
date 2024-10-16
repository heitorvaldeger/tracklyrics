import { randomUUID } from 'node:crypto'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { test } from '@japa/runner'
import { ok } from '../../../app/helpers/http.js'

test.group('VideoController', (group) => {
  group.teardown(async () => {
    await Video.query().whereNotNull('id').delete()
  })
  test('should returns 200 if a list videos returns on success', async ({ assert }) => {
    const uuid = randomUUID()
    const fakeVideo = {
      isDraft: false,
      title: 'any_title',
      artist: 'any_artist',
      qtyViews: BigInt(0),
      releaseYear: '2000',
      linkYoutube: 'any_link',
      uuid: uuid,
    }
    await Video.create(fakeVideo)
    const sut = new VideoController()
    const videos = await sut.findAll()

    assert.deepEqual(videos, ok([fakeVideo]))
  })
})
