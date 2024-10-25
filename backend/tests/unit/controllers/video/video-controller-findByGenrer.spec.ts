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

test.group('VideoController.findByGenrer', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })
    const { videoStub, sut } = await makeSut()
    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(ok([videoStub]))
  })

  test('should returns 400 if pass invalid genrerId on findByGenrer', async ({ expect }) => {
    const { sut } = await makeSut()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      genrerId: 'any_genrerId',
    })

    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'genrerId',
          message: 'The genrerId field must be a number',
        },
      ])
    )
  })

  test('should returns 500 if video find throws', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })

    const { sut, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'findByGenrer').throws(new Error())

    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
