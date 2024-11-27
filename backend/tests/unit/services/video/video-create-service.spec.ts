import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoCreateService } from '#services/video/video-create-service'
import { mockFakeVideoSaveResultModel } from '#tests/factories/fakes/index'
import { mockVideoRequest } from '#tests/factories/fakes/mock-video-request'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { test } from '@japa/runner'
import { stub, spy } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoCreateService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('Video Create Service', () => {
  test('should return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(mockVideoRequest())

    expect(videoResponse).toEqual(createSuccessResponse(mockFakeVideoSaveResultModel()))
  })

  test('should return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    const getUserIdSpy = spy(authServiceStub, 'getUserId')
    await sut.create(mockVideoRequest())

    expect(getUserIdSpy.returned(0)).toBeTruthy()
  })

  test('should return an error if link youtube already exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').returns(new Promise((resolve) => resolve(true)))
    const videResponse = await sut.create(mockVideoRequest())
    expect(videResponse).toEqual(
      createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    )
  })
})
