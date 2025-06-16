import { test } from '@japa/runner'
import { stub } from 'sinon'

import DeleteFavoriteController from '#controllers/favorite/DeleteFavoriteController'
import ValidationException from '#exceptions/ValidationException'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockFavoriteService } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: 'any_uuid',
    }
  )

  const sut = new DeleteFavoriteController(mockFavoriteService, validatorSchema)

  return { sut, httpContext }
}

test.group('Favorite/DeleteFavoriteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided on remove', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))
    const promise = sut.handle(context)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 404 if a video not found on remove', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockFavoriteService, 'removeFavorite').rejects(new VideoNotFoundException())

    const promise = sut.handle(httpContext)

    await expect(promise).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 if video was remove favorite on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.handle(httpContext)
    expect(httpResponse).toBeTruthy()
  })

  test('return 500 if video remove favorite throws', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(mockFavoriteService, 'removeFavorite').throws(new Error())

    const promise = sut.handle(httpContext)

    await expect(promise).rejects.toEqual(new Error())
  })
})
