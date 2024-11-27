import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoDeleteService } from '#services/video/video-delete-service'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { mockVideoOwnedCurrentUserServiceStub } from '#tests/factories/stubs/video/mock-video-owned-current-user-service-stub'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const videoOwnedCurrentUserServiceStub = mockVideoOwnedCurrentUserServiceStub()
  const sut = new VideoDeleteService(videoRepositoryStub, videoOwnedCurrentUserServiceStub)

  return { sut, videoRepositoryStub, videoOwnedCurrentUserServiceStub }
}

test.group('Video Delete Service', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return success if a video deleted on success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.delete(faker.string.uuid())

    expect(response).toEqual(createSuccessResponse(true))
  })

  test('should return an error if video not exists', async ({ expect }) => {
    const { sut, videoOwnedCurrentUserServiceStub } = makeSut()
    stub(videoOwnedCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(
      Promise.resolve(true)
    )
    const response = await sut.delete(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoOwnedCurrentUserServiceStub } = makeSut()
    stub(videoOwnedCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(
      Promise.resolve(true)
    )
    const response = await sut.delete(faker.string.uuid())

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
