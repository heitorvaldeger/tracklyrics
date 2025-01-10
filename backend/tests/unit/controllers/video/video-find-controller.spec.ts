import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import sinon, { stub } from 'sinon'

import VideoFindController from '#controllers/video/video-find-controller'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'
import { mockVideoFindServiceStub } from '#tests/factories/stubs/services/mock-video-find-service-stub'
import { NilUUID } from '#tests/utils/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: faker.string.uuid(),
    }
  )
  const videoServiceStub = mockVideoFindServiceStub()
  const sut = new VideoFindController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoFindController.find()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('returns 200 if return a video on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(ok(mockVideoModel()))
  })

  test('returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'find').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('returns 400 if a invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('returns 500 if video find throws', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'find').throws(new Error())

    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
