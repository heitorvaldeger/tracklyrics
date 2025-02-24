import { test } from '@japa/runner'
import _ from 'lodash'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoUserLoggedService } from '#services/video/video-user-logged-service'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockVideoData, mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()

  const sut = new VideoUserLoggedService(videoRepositoryStub, authStrategyStub)

  return { sut, videoRepositoryStub, authStrategyStub }
}

test.group('VideoUserLoggedService', () => {
  test('it must return an video list by user logged on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.getVideosByUserLogged()

    expect(video).toEqual(createSuccessResponse([mockVideoData]))
  })

  test('it must return failure if getUserUuid return undefined', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserUuid.returns(undefined)

    const video = await sut.getVideosByUserLogged()

    expect(video).toEqual(createFailureResponse(APPLICATION_MESSAGES.UNAUTHORIZED))
  })
})
