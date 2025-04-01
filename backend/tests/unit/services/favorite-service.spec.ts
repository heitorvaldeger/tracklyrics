import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenericException from '#exceptions/generic-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { FavoriteService } from '#services/favorite-service'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockFavoriteRepository } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { mockVideoData, mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedService } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const { authStub } = mockAuth()
  const sut = new FavoriteService(
    mockVideoRepository,
    mockFavoriteRepository,
    authStub,
    mockVideoUserLoggedService
  )

  return {
    sut,
  }
}

test.group('FavoriteService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video was added to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.saveFavorite(faker.string.uuid())

    expect(response).toBe(true)
  })

  test("return fail if a video wasn't added to favorite", async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockFavoriteRepository, 'saveFavorite').returns(Promise.resolve(false))
    const response = sut.saveFavorite(faker.string.uuid())

    expect(response).rejects.toEqual(new GenericException())
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
    const response = sut.saveFavorite(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('return success if a video was removed to favorite', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.removeFavorite(faker.string.uuid())

    expect(response).toEqual(true)
  })

  test("return fail if a video wasn't removed to favorite", async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockFavoriteRepository, 'removeFavorite').returns(Promise.resolve(false))
    const response = sut.removeFavorite(faker.string.uuid())

    expect(response).rejects.toEqual(new GenericException())
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
    const response = sut.removeFavorite(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('return a list favorite videos by user logged', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.findFavoritesByUserLogged()

    expect(response).toEqual([mockVideoData, mockVideoData])
  })
})
