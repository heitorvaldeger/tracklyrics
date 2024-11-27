import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoService } from '#services/video-service'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockFavoriteRepositoryStub } from '#tests/factories/stubs/mock-favorite-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

const makeSut = () => {
  const favoriteRepositoryStub = mockFavoriteRepositoryStub()
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoService(favoriteRepositoryStub, videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub, favoriteRepositoryStub }
}

test.group('VideoService.removeFavorite()', () => {
  test('should return success if a video was removed to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test("should return fail if a video wasn't removed to favorite", async ({ expect }) => {
    const { sut, favoriteRepositoryStub } = makeSut()
    stub(favoriteRepositoryStub, 'removeFavorite').returns(Promise.resolve(false))
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE)
    )
  })

  test('should return an error if video not belong from user', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    stub(authServiceStub, 'getUserId').returns(-1)
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
