import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { ok } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { IVideoResponse } from '#interfaces/IVideoResponse'
import { IVideoService } from '#services/interfaces/IVideoService'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'

const makeSut = async () => {
  const { fakeVideo, language, genrer } = await makeFakeVideo()

  const videoServiceStub = makeFakeVideoServiceStub(fakeVideo, language, genrer)
  const sut = new VideoController(videoServiceStub)

  return { sut, fakeVideo, language, genrer, videoServiceStub }
}

test.group('VideoController.findAll', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const { fakeVideo, language, genrer, sut } = await makeSut()
    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(
      ok([
        {
          ..._.omit(fakeVideo, 'languageId', 'genrerId'),
          language: language.name,
          genrer: genrer.name,
        },
      ])
    )
  })
})
