import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/video-controller'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { makeVideoServiceStub } from '#tests/factories/stubs/makeVideoServiceStub'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { randomUUID } from 'node:crypto'
import { NilUUID } from '#tests/utils/NilUUID'
import { makeFakeRequest } from './factories/make-fake-request.js'

const makeSut = async () => {
  const httpContext = makeHttpRequest(makeFakeRequest(), {
    uuid: randomUUID(),
  })

  const videoServiceStub = makeVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoController.addFavorite()', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.addFavorite(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 404 if return a video not found', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'addFavorite').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.addFavorite(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND.message))
  })

  test('should returns 200 if video was add favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.addFavorite(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 500 if video add favorite throws', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: randomUUID(),
    })

    stub(videoServiceStub, 'addFavorite').throws(new Error())

    const httpResponse = await sut.addFavorite(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
