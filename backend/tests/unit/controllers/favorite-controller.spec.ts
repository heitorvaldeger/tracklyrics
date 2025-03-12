import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import FavoriteController from '#controllers/favorite-controller'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { mockFavoriteServiceStub } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { mockVideoData } from '#tests/__mocks__/stubs/mock-video-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: randomUUID(),
    }
  )

  const favoriteServiceStub = mockFavoriteServiceStub()
  const sut = new FavoriteController(favoriteServiceStub)

  return { sut, httpContext, favoriteServiceStub }
}

test.group('FavoriteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('returns 400 if invalid video uuid is provided', async ({ expect }) => {
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

  test('returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(favoriteServiceStub, 'removeFavorite').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.removeFavorite(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('returns 200 if video was remove favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.removeFavorite(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('returns 500 if video remove favorite throws', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()

    stub(favoriteServiceStub, 'removeFavorite').throws(new Error())

    const httpResponse = await sut.removeFavorite(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('returns 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.saveFavorite(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('returns 404 if return a video not found', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(favoriteServiceStub, 'saveFavorite').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.saveFavorite(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('returns 200 if video was add favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.saveFavorite(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('returns 500 if video add favorite throws', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: faker.string.uuid(),
    })

    stub(favoriteServiceStub, 'saveFavorite').throws(new Error())

    const httpResponse = await sut.saveFavorite(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('returns 200 on find favorites by user logged', async ({ expect }) => {
    const { sut } = await makeSut()

    const httpResponse = await sut.findFavoritesByUserLogged()

    expect(httpResponse).toEqual(ok([mockVideoData, mockVideoData]))
  })

  test('returns 500 if find favorites by user logged throws', async ({ expect }) => {
    const { sut, favoriteServiceStub } = await makeSut()

    stub(favoriteServiceStub, 'findFavoritesByUserLogged').throws(new Error())

    const httpResponse = await sut.findFavoritesByUserLogged()

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
