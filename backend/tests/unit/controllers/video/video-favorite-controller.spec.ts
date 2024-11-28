import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { randomUUID } from 'node:crypto'
import { NilUUID } from '#tests/utils/NilUUID'
import { mockVideoRequest } from '../../../factories/fakes/mock-video-request.js'
import VideoFavoriteController from '#controllers/video/video-favorite-controller'
import { faker } from '@faker-js/faker'
import { VideoFavoriteProtocolService } from '#services/video/protocols/video-favorite-protocol-service'

export const mockVideoFavoriteServiceStub = (): VideoFavoriteProtocolService => ({
  addFavorite: (videoUuid: string) => Promise.resolve(createSuccessResponse(true)),
  removeFavorite: (videoUuid: string) => Promise.resolve(createSuccessResponse(true)),
})
const makeSut = async () => {
  const httpContext = makeHttpRequest(mockVideoRequest(), {
    uuid: randomUUID(),
  })

  const videoFavoriteServiceStub = mockVideoFavoriteServiceStub()
  const sut = new VideoFavoriteController(videoFavoriteServiceStub)

  return { sut, httpContext, videoFavoriteServiceStub }
}

test.group('Video Favorite Controller', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.removeFavorite(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, videoFavoriteServiceStub } = await makeSut()
    stub(videoFavoriteServiceStub, 'removeFavorite').resolves(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.removeFavorite(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should returns 200 if video was remove favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.removeFavorite(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 500 if video remove favorite throws', async ({ expect }) => {
    const { sut, httpContext, videoFavoriteServiceStub } = await makeSut()

    stub(videoFavoriteServiceStub, 'removeFavorite').throws(new Error())

    const httpResponse = await sut.removeFavorite(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
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
    const { sut, httpContext, videoFavoriteServiceStub } = await makeSut()
    stub(videoFavoriteServiceStub, 'addFavorite').resolves(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.addFavorite(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should returns 200 if video was add favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.addFavorite(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 500 if video add favorite throws', async ({ expect }) => {
    const { sut, httpContext, videoFavoriteServiceStub } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: faker.string.uuid(),
    })

    stub(videoFavoriteServiceStub, 'addFavorite').throws(new Error())

    const httpResponse = await sut.addFavorite(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
