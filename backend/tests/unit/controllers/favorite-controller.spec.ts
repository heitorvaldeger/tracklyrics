import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import FavoriteController from '#controllers/favorite-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockFavoriteService } from '#tests/__mocks__/stubs/mock-favorite-stub'
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

  const sut = new FavoriteController(mockFavoriteService)

  return { sut, httpContext }
}

test.group('FavoriteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided on remove', async ({ expect }) => {
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

  test('return 404 if a video not found on remove', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockFavoriteService, 'removeFavorite').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.removeFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 if video was remove favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.removeFavorite(httpContext)
    expect(httpResponse).toBeTruthy()
  })

  test('return 500 if video remove favorite throws', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(mockFavoriteService, 'removeFavorite').throws(new Error())

    const httpResponse = sut.removeFavorite(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
  test('return 200 on find favorites by user logged', async ({ expect }) => {
    const { sut } = await makeSut()

    const httpResponse = await sut.findFavoritesByUserLogged()

    expect(httpResponse).toEqual([mockVideoData, mockVideoData])
  })

  test('return 500 if find favorites by user logged throws', async ({ expect }) => {
    const { sut } = await makeSut()

    stub(mockFavoriteService, 'findFavoritesByUserLogged').throws(new Error())

    const httpResponse = sut.findFavoritesByUserLogged()

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
