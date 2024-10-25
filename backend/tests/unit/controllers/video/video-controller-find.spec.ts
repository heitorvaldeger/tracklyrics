import _ from 'lodash'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'

const makeSut = async () => {
  const { fakeVideo, language, genrer } = await makeFakeVideo()

  const { videoServiceStub, videoStub } = makeFakeVideoServiceStub(fakeVideo, language, genrer)
  const sut = new VideoController(videoServiceStub)

  return { sut, videoStub, videoServiceStub }
}

test.group('VideoController.find', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if a video return on success', async ({ expect }) => {
    const { sut, videoStub } = await makeSut()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: videoStub.uuid,
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(ok(videoStub))
  })

  test('should returns 404 if a video return not found', async ({ expect }) => {
    const { sut, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'find').returns(new Promise((resolve) => resolve(null)))
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid on find', async ({ expect }) => {
    const { sut } = await makeSut()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 500 if video find throws', async ({ expect }) => {
    const { sut, videoServiceStub, videoStub } = await makeSut()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: videoStub.uuid,
    })
    stub(videoServiceStub, 'find').throws(new Error())

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
