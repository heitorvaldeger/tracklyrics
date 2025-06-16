import { test } from '@japa/runner'
import _ from 'lodash'
import { spy, stub } from 'sinon'

import FindByVideoController from '#controllers/video/FindByVideoController'
import ValidationException from '#exceptions/ValidationException'
import { mockVideoData, mockVideoFindService } from '#tests/__mocks__/stubs/mock-video-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = () => {
  const httpContext = makeHttpRequest()
  const sut = new FindByVideoController(mockVideoFindService, validatorSchema)
  return { sut, httpContext }
}

test.group('Video/FindByVideoController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 if return a list videos on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.handle(httpContext)
    expect(httpResponse).toEqual([mockVideoData])
  })

  test('calls VideoFindService findBy with correct values', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const findBySpy = spy(mockVideoFindService, 'findBy')
    stub(httpContext.request, 'qs').returns({
      genreId: 0,
      languageId: 0,
      userUuid: NilUUID,
    })

    await sut.handle(httpContext)
    expect(
      findBySpy.calledWith({
        genreId: 0,
        languageId: 0,
        userUuid: NilUUID,
      })
    ).toBeTruthy()
  })

  test('return a Validator exception if invalid params is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(ctx)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 500 if video findBy return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockVideoFindService, 'findBy').throws(new Error())
    const httpResponse = sut.handle(httpContext)
    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
