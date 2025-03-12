import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import VideoUserLoggedController from '#controllers/video/video-user-logged-controller'
import { ok, serverError, unauthorized } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import {
  mockVideoData,
  mockVideoUserLoggedServiceStub,
} from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoUserLoggedServiceStub = mockVideoUserLoggedServiceStub()
  const sut = new VideoUserLoggedController(videoUserLoggedServiceStub)

  return { sut, videoUserLoggedServiceStub }
}

test.group('VideoUserLoggedController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('returns 200 if return a video list on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.getVideosByUserLogged()

    expect(httpResponse).toEqual(ok([mockVideoData]))
  })

  test('returns 401 if user is not authorized', async ({ expect }) => {
    const { sut, videoUserLoggedServiceStub } = makeSut()
    stub(videoUserLoggedServiceStub, 'getVideosByUserLogged').resolves(
      createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED)
    )

    const httpResponse = await sut.getVideosByUserLogged()

    expect(httpResponse).toEqual(unauthorized(APPLICATION_MESSAGES.UNAUTHORIZED))
  })

  test('return 500 if user getVideosByUserLogged throws', async ({ expect }) => {
    const { sut, videoUserLoggedServiceStub } = makeSut()

    stub(videoUserLoggedServiceStub, 'getVideosByUserLogged').throws(new Error())

    const httpResponse = await sut.getVideosByUserLogged()

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
