import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { FavoriteService } from '#services/favorite-service'
import { mockAuthServiceStub } from '#tests/factories/stubs/services/mock-auth-service-stub'
import { mockFavoriteRepositoryStub } from '#tests/factories/stubs/repository/mock-favorite-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/factories/stubs/services/mock-video-current-user-service-stub'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'
import { mockFakeFavoriteModel } from '#tests/factories/fakes/mock-fake-video-model'

const makeSut = () => {
  const favoriteRepositoryStub = mockFavoriteRepositoryStub()
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const videoCurrentUserServiceStub = mockVideoCurrentUserServiceStub()
  const sut = new FavoriteService(
    videoRepositoryStub,
    favoriteRepositoryStub,
    authServiceStub,
    videoCurrentUserServiceStub
  )

  return {
    sut,
    videoRepositoryStub,
    authServiceStub,
    favoriteRepositoryStub,
    videoCurrentUserServiceStub,
  }
}

test.group('Favorite Service', () => {
  test('should return success if a video was added to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test("should return fail if a video wasn't added to favorite", async ({ expect }) => {
    const { sut, favoriteRepositoryStub } = makeSut()
    stub(favoriteRepositoryStub, 'addFavorite').returns(Promise.resolve(false))
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(
      createFailureResponse(APPLICATION_ERRORS.VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE)
    )
  })

  test('should return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

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
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should return a list favorite videos by user logged', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.findFavoritesByUserLogged()

    expect(response).toEqual(
      createSuccessResponse([mockFakeFavoriteModel(), mockFakeFavoriteModel()])
    )
  })
})
