import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import sinon, { stub } from 'sinon'

import VideoFindController from '#controllers/video-find-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockVideoData, mockVideoFindService } from '#tests/__mocks__/stubs/mock-video-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: faker.string.uuid(),
    }
  )
  const sut = new VideoFindController(mockVideoFindService)

  return { sut, httpContext }
}

test.group('VideoFindController.find()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 if return a video on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(mockVideoData)
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockVideoFindService, 'find').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.find(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 400 if a invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.find(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('return 500 if video find throws', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(mockVideoFindService, 'find').throws(new Error())

    const httpResponse = sut.find(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
