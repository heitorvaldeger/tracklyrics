import _ from 'lodash'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

const makeSut = async () => {
  const fakeVideo = await makeFakeVideo()
  const httpContext = new HttpContextFactory().create()
  const videoServiceStub = makeFakeVideoServiceStub(fakeVideo)
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, fakeVideo, videoServiceStub }
}

test.group('VideoController.find', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if a video return on success', async ({ expect }) => {
    const { sut, httpContext, fakeVideo } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(ok(fakeVideo))
  })

  test('should returns 404 if a video return not found', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'find').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid on find', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
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
    const { sut, httpContext, videoServiceStub, fakeVideo } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
    stub(videoServiceStub, 'find').throws(new Error())

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
