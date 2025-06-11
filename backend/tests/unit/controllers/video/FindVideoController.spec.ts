import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import FindVideoController from '#controllers/video/FindVideoController'
import ValidationException from '#exceptions/ValidationException'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockVideoData, mockVideoFindService } from '#tests/__mocks__/stubs/mock-video-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest()
  const sut = new FindVideoController(mockVideoFindService, validatorSchema)

  return { sut, httpContext }
}

test.group('Video/FindVideoController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 if return a video on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.handle(httpContext)

    expect(httpResponse).toEqual(mockVideoData)
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockVideoFindService, 'find').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new VideoNotFoundException())
  })

  test('return a Validator exception if an invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(ctx)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 500 if video find throws', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockVideoFindService, 'find').throws(new Error())

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
