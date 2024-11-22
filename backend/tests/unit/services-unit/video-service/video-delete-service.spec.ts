import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoService } from '#services/video-service'
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

test.group('VideoService.delete()', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return success if a video deleted on success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.delete('any_uuid')

    expect(response).toEqual(createSuccessResponse(true))
  })

  test('should return an error if video not exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').returns(new Promise((resolve) => resolve(null)))
    stub(videoRepositoryStub, 'getUserId').returns(new Promise((resolve) => resolve(-1)))
    const response = await sut.delete('any_uuid')

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })

  test('should return an error if video not belong from user', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    stub(authServiceStub, 'getUserId').returns(-1)
    const response = await sut.delete('any_uuid')

    expect(response).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
