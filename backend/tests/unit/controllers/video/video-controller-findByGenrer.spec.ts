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
  const fakeVideo = await makeFakeVideo()
  const videoServiceStub = makeFakeVideoServiceStub(fakeVideo)
  const httpContext = new HttpContextFactory().create()
  const sut = new VideoController(videoServiceStub)

  return { sut, fakeVideo, videoServiceStub, httpContext }
}

test.group('VideoController.findByGenrer', (group) => {
  group.setup(async () => {
    await Video.query().whereNotNull('id').delete()
  })

  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const { sut, fakeVideo, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })
    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(ok([fakeVideo]))
  })

  test('should returns 400 if pass invalid genrerId on findByGenrer', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
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
    const { sut, videoServiceStub, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })

    stub(videoServiceStub, 'findByGenrer').throws(new Error())

    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
