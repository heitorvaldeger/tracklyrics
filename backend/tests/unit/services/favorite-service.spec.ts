import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { FavoriteService } from '#services/favorite-service'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockFavoriteRepositoryStub } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { mockVideoData, mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedServiceStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const favoriteRepositoryStub = mockFavoriteRepositoryStub()
  const videoRepositoryStub = mockVideoRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()
  const videoCurrentUserServiceStub = mockVideoUserLoggedServiceStub()
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
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
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
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return a list favorite videos by user logged', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.findFavoritesByUserLogged()

    expect(response).toEqual(createSuccessResponse([mockVideoData, mockVideoData]))
  })
})
