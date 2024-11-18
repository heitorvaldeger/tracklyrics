import { test } from '@japa/runner'
import { stub } from 'sinon'
import { VideoService } from '#services/video-service'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import _ from 'lodash'
import { makeAuthServiceStub } from '#tests/factories/stubs/makeAuthServiceStub'
import { makeVideoRepositoryStub } from '#tests/factories/stubs/makeVideoRepositoryStub'
import { makeFakeVideoModel } from '#tests/factories/fakes/makeFakeVideoModel'

const makeSut = () => {
  const videoRepositoryStub = makeVideoRepositoryStub()
  const authServiceStub = makeAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.find()', () => {
  test('should return an video on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.find('any_uuid')

    expect(video).toEqual(createSuccessResponse(makeFakeVideoModel()))
  })

  test('should return an error if a video not found', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').returns(new Promise((resolve) => resolve(null)))
    const video = await sut.find('any_uuid')

    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
