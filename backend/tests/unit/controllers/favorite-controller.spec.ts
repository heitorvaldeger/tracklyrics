import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import FavoriteController from '#controllers/favorite-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
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

  test('returns 400 if invalid video uuid is provided on remove', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(context.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.removeFavorite(context)

    expect(context.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('returns 404 if a video not found on remove', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(favoriteServiceStub, 'removeFavorite').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.removeFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('returns 200 if video was remove favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.removeFavorite(httpContext)
    expect(httpResponse).toBeTruthy()
  })

  test('returns 500 if video remove favorite throws', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()

    stub(favoriteServiceStub, 'removeFavorite').throws(new Error())

    const httpResponse = sut.removeFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })

  test('returns 400 if invalid video uuid is provided on save', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(context.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.saveFavorite(context)

    expect(context.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('returns 404 if return a video not found on save', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(favoriteServiceStub, 'saveFavorite').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.saveFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('returns 200 if video was add favorite on save', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.saveFavorite(httpContext)
    expect(httpResponse).toBeTruthy()
  })

  test('returns 500 if video add favorite throws on save', async ({ expect }) => {
    const { sut, httpContext, favoriteServiceStub } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: faker.string.uuid(),
    })

    stub(favoriteServiceStub, 'saveFavorite').throws(new Error())

    const httpResponse = sut.saveFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })

  test('returns 200 on find favorites by user logged', async ({ expect }) => {
    const { sut } = await makeSut()

    const httpResponse = await sut.findFavoritesByUserLogged()

    expect(httpResponse).toEqual([mockVideoData, mockVideoData])
  })

  test('returns 500 if find favorites by user logged throws', async ({ expect }) => {
    const { sut, favoriteServiceStub } = await makeSut()

    stub(favoriteServiceStub, 'findFavoritesByUserLogged').throws(new Error())

    const httpResponse = sut.findFavoritesByUserLogged()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
