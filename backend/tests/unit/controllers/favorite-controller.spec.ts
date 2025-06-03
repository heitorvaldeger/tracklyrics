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
