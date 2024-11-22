import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoService } from '#services/video-service'
import { makeFakeVideoSaveResultModel } from '#tests/factories/fakes/makeFakeVideoSaveResultModel'
import { fakeVideoRequest } from '#tests/factories/objects'
import { makeAuthServiceStub } from '#tests/factories/stubs/makeAuthServiceStub'
import { makeVideoRepositoryStub } from '#tests/factories/stubs/makeVideoRepositoryStub'
import { test } from '@japa/runner'
import Sinon, { stub, spy } from 'sinon'

const makeSut = () => {
  const videoRepositoryStub = makeVideoRepositoryStub()
  const authServiceStub = makeAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.create()', () => {
  test('should return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(fakeVideoRequest)

    expect(videoResponse).toEqual(createSuccessResponse(makeFakeVideoSaveResultModel()))
  })

  test('should return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    const getUserIdSpy = spy(authServiceStub, 'getUserId')
    await sut.create(fakeVideoRequest)

    expect(getUserIdSpy.returned(0)).toBeTruthy()
  })

  test('should return an error if link youtube already exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').returns(new Promise((resolve) => resolve(true)))
    const videResponse = await sut.create(fakeVideoRequest)
    expect(videResponse).toEqual(
      createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    )
  })
})
