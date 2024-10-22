import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { ok } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'

test.group('VideoController.findAll', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const fakeVideo = await makeFakeVideo()
    const sut = new VideoController()
    const videos = await sut.findAll()

    expect(videos).toEqual(ok([fakeVideo]))
  })
})
