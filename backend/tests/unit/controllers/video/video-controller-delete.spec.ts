import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, noContent, notFound, serverError } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { makeVideoServiceStub } from '#tests/factories/stubs/makeVideoServiceStub'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

const makeSut = () => {
  const httpContext = new HttpContextFactory().create()
  const videoServiceStub = makeVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoController.delete', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 204 if video was delete on success', async ({ expect }) => {
    const fakeVideo = await makeFakeVideo()
    const { sut, httpContext } = makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(noContent())
  })

  test('should returns 404 if a video return not found on delete', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = makeSut()
    stub(videoServiceStub, 'delete').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid on delete', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 500 if video delete throws', async ({ expect }) => {
    const fakeVideo = await makeFakeVideo()
    const { sut, httpContext, videoServiceStub } = makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    stub(videoServiceStub, 'delete').throws(new Error())

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
