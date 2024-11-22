import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/video-controller'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { mockVideoServiceStub } from '#tests/factories/stubs/mock-video-service-stub'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { randomUUID } from 'node:crypto'
import { NilUUID } from '#tests/utils/NilUUID'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'

const makeSut = () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: randomUUID(),
    }
  )
  const videoServiceStub = mockVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoController.delete()', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 204 if video was delete on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = makeSut()
    stub(videoServiceStub, 'delete').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND.message))
  })

  test('should returns 400 if a invalid uuid is provided', async ({ expect }) => {
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
    const { sut, httpContext, videoServiceStub } = makeSut()

    stub(videoServiceStub, 'delete').throws(new Error())

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
