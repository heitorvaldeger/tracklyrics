import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoService } from '#services/video-service'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'
import { stub } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.addFavorite()', () => {
  test('should return success if a video was added to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.addFavorite(randomUUID())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test("should return fail if a video wasn't added to favorite", async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'addFavorite').returns(Promise.resolve(false))
    const response = await sut.addFavorite(randomUUID())

    expect(response).toEqual(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE)
    )
  })

  test('should return an error if video not belong from user', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    stub(authServiceStub, 'getUserId').returns(-1)
    const response = await sut.addFavorite(randomUUID())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
