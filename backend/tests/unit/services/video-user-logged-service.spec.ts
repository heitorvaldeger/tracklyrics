import { test } from '@japa/runner'
import _ from 'lodash'

import UnauthorizedException from '#exceptions/unauthorized-exception'
import { VideoUserLoggedService } from '#services/video-user-logged-service'
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

    expect(video).toEqual([mockVideoData])
  })

  test('it must return failure if getUserUuid return undefined', ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserUuid.returns(undefined)

    const video = sut.getVideosByUserLogged()

    expect(video).rejects.toEqual(new UnauthorizedException())
  })
})
