import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import FindFavoritesByUserLoggedController from '#controllers/favorite/FindFavoritesByUserLoggedController'
import { mockFavoriteService } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { mockVideoData } from '#tests/__mocks__/stubs/mock-video-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = async () => {
  const httpContext = makeHttpRequest()

  const sut = new FindFavoritesByUserLoggedController(mockFavoriteService)

  return { sut, httpContext }
}

test.group('FavoriteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 on find favorites by user logged', async ({ expect }) => {
    const { sut } = await makeSut()

    const httpResponse = await sut.handle()

    expect(httpResponse).toEqual([mockVideoData, mockVideoData])
  })

  test('return 500 if find favorites by user logged throws', async ({ expect }) => {
    const { sut } = await makeSut()

    stub(mockFavoriteService, 'findFavoritesByUserLogged').throws(new Error())

    const promise = sut.handle()

    await expect(promise).rejects.toEqual(new Error())
  })
})
