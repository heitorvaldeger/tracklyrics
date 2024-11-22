import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoService } from '#services/video-service'
import { fakeVideoRequest } from '#tests/factories/objects'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.update()', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(fakeVideoRequest, 'any_uuid')

    expect(updated).toEqual(createSuccessResponse(true))
  })

  test('should return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    const getUserIdSpy = sinon.spy(authServiceStub, 'getUserId')
    await sut.update(fakeVideoRequest, 'any_uuid')

    expect(getUserIdSpy.returned(0)).toBeTruthy()
  })

  test('should returns a error if link youtube already exists on update', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').returns(new Promise((resolve) => resolve(true)))
    const video = await sut.update(fakeVideoRequest, 'any_uuid')
    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS))
  })

  test('should returns a error if video not exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').returns(new Promise((resolve) => resolve(null)))
    stub(videoRepositoryStub, 'getUserId').returns(new Promise((resolve) => resolve(1)))
    const video = await sut.update(fakeVideoRequest, 'any_uuid')

    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
