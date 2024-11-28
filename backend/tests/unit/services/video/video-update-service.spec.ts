import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoUpdateService } from '#services/video/video-update-service'
import { mockVideoRequest } from '#tests/factories/fakes/mock-video-request'
import { mockAuthServiceStub } from '#tests/factories/stubs/services/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/factories/stubs/services/mock-video-current-user-service-stub'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const videoCurrentUserServiceStub = mockVideoCurrentUserServiceStub()
  const sut = new VideoUpdateService(
    videoRepositoryStub,
    authServiceStub,
    videoCurrentUserServiceStub
  )

  return { sut, videoRepositoryStub, authServiceStub, videoCurrentUserServiceStub }
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
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const video = await sut.update(mockVideoRequest(), faker.string.uuid())
    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS))
  })

  test('should returns a error if video not exists', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const video = await sut.update(mockVideoRequest(), faker.string.uuid())

    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
