import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { ok } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'

const makeSut = async () => {
  const { fakeVideo, language, genrer } = await makeFakeVideo()

  const { videoServiceStub, videoStub } = makeFakeVideoServiceStub(fakeVideo, language, genrer)
  const sut = new VideoController(videoServiceStub)

  return { sut, videoStub, videoServiceStub }
}

test.group('VideoController.findAll', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const { videoStub, sut } = await makeSut()
    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([videoStub]))
  })
})
