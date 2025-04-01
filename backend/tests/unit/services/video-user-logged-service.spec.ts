import { test } from '@japa/runner'
import _ from 'lodash'

import UnauthorizedException from '#exceptions/unauthorized-exception'
import { VideoUserLoggedService } from '#services/video-user-logged-service'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockVideoData, mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const { authStub } = mockAuth()

  const sut = new VideoUserLoggedService(mockVideoRepository, authStub)

  return { sut, authStub }
}

test.group('VideoUserLoggedService', () => {
  test('it must return an video list by user logged on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.getVideosByUserLogged()

    expect(video).toEqual([mockVideoData])
  })
})
