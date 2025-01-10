import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { FavoriteService } from '#services/favorite-service'
import { mockAuthStrategy } from '#tests/factories/mocks/mock-auth-strategy'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'
import { mockFavoriteRepositoryStub } from '#tests/factories/stubs/repository/mock-favorite-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/factories/stubs/services/mock-video-current-user-service-stub'

const makeSut = () => {
  const favoriteRepositoryStub = mockFavoriteRepositoryStub()
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authStrategyStub = mockAuthStrategy()
  const videoCurrentUserServiceStub = mockVideoCurrentUserServiceStub()
  const sut = new FavoriteService(
    videoRepositoryStub,
    favoriteRepositoryStub,
    authStrategyStub,
    videoCurrentUserServiceStub
  )

  return {
    sut,
    videoRepositoryStub,
    favoriteRepositoryStub,
    videoCurrentUserServiceStub,
  }
}

test.group('FavoriteService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video was added to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test("return fail if a video wasn't added to favorite", async ({ expect }) => {
    const { sut, favoriteRepositoryStub } = makeSut()
    stub(favoriteRepositoryStub, 'addFavorite').returns(Promise.resolve(false))
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_UNPOSSIBLE_ADD_TO_FAVORITE)
    )
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const response = await sut.addFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return success if a video was removed to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test("return fail if a video wasn't removed to favorite", async ({ expect }) => {
    const { sut, favoriteRepositoryStub } = makeSut()
    stub(favoriteRepositoryStub, 'removeFavorite').returns(Promise.resolve(false))
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_UNPOSSIBLE_REMOVE_TO_FAVORITE)
    )
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return a list favorite videos by user logged', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.findFavoritesByUserLogged()

    expect(response).toEqual(createSuccessResponse([mockVideoModel(), mockVideoModel()]))
  })
})
