import { test } from '@japa/runner'
import { stub } from 'sinon'

import SaveFavoriteController from '#controllers/favorite/SaveFavoriteController'
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

  const sut = new SaveFavoriteController(mockFavoriteService, validatorSchema)

  return { sut, httpContext }
}

test.group('Favorite/SaveFavoriteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return an exception if Validation throws', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(context)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 404 if return a video not found on save', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockFavoriteService, 'saveFavorite').rejects(new VideoNotFoundException())

    const httpResponse = sut.handle(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 if video was add favorite on save', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.handle(httpContext)
    expect(httpResponse).toBeTruthy()
  })

  test('return 500 if video add favorite throws on save', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(mockFavoriteService, 'saveFavorite').throws(new Error())

    const httpResponse = sut.handle(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
