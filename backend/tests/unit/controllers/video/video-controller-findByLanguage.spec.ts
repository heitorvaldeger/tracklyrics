import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { stub } from 'sinon'
import { badRequest, ok, serverError } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

const makeSut = async () => {
  const { fakeVideo, language, genrer } = await makeFakeVideo()

  const { videoServiceStub, videoStub } = makeFakeVideoServiceStub(fakeVideo, language, genrer)
  const sut = new VideoController(videoServiceStub)

  return { sut, videoStub, videoServiceStub }
}

test.group('VideoController.findByLanguage', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      languageId: 0,
    })
    const { videoStub, sut } = await makeSut()
    const httpResponse = await sut.findByLanguage(httpContext)

    expect(httpResponse).toEqual(ok([videoStub]))
  })

  test('should returns 400 if pass invalid languageId on findByLanguage', async ({ expect }) => {
    const { sut } = await makeSut()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      languageId: 'any_value',
    })

    const httpResponse = await sut.findByLanguage(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'languageId',
          message: 'The languageId field must be a number',
        },
      ])
    )
  })

  test('should returns 500 if video find throws', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      languageId: 0,
    })

    const { sut, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'findByLanguage').throws(new Error())

    const httpResponse = await sut.findByLanguage(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
