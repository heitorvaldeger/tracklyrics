import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoUpdateService } from '#services/video/video-update-service'
import { mockVideoRequest } from '#tests/factories/fakes/mock-video-request'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { mockVideoOwnedCurrentUserServiceStub } from '#tests/factories/stubs/video/mock-video-owned-current-user-service-stub'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const videoOwnedCurrentUserServiceStub = mockVideoOwnedCurrentUserServiceStub()
  const sut = new VideoUpdateService(
    videoRepositoryStub,
    authServiceStub,
    videoOwnedCurrentUserServiceStub
  )

  return { sut, videoRepositoryStub, authServiceStub, videoOwnedCurrentUserServiceStub }
}

test.group('Video Update Service', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(mockVideoRequest(), faker.string.uuid())

    expect(updated).toEqual(createSuccessResponse(true))
  })

  test('should return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    const getUserIdSpy = sinon.spy(authServiceStub, 'getUserId')
    await sut.update(mockVideoRequest(), faker.string.uuid())

    expect(getUserIdSpy.returned(0)).toBeTruthy()
  })

  test('should returns a error if link youtube already exists on update', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').returns(new Promise((resolve) => resolve(true)))
    const video = await sut.update(mockVideoRequest(), faker.string.uuid())
    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS))
  })

  test('should returns a error if video not exists', async ({ expect }) => {
    const { sut, videoOwnedCurrentUserServiceStub } = makeSut()
    stub(videoOwnedCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(
      Promise.resolve(true)
    )
    const video = await sut.update(mockVideoRequest(), faker.string.uuid())

    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
