import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import VideoDeleteController from '#controllers/video/video-delete-controller'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoDeleteProtocolService } from '#services/video/protocols/video-delete-protocol-service'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { NilUUID } from '#tests/utils/NilUUID'

export const mockVideoDeleteServiceStub = (): VideoDeleteProtocolService => ({
  delete: (uuid: string) => Promise.resolve(createSuccessResponse(true)),
})

const makeSut = () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: faker.string.uuid(),
    }
  )
  const videoDeleteServiceStub = mockVideoDeleteServiceStub()
  const sut = new VideoDeleteController(videoDeleteServiceStub)

  return { sut, httpContext, videoDeleteServiceStub }
}

test.group('Video Delete Controller', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if video was delete on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, videoDeleteServiceStub } = makeSut()
    stub(videoDeleteServiceStub, 'delete').resolves(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
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
    const { sut, httpContext, videoDeleteServiceStub } = makeSut()

    stub(videoDeleteServiceStub, 'delete').throws(new Error())

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
