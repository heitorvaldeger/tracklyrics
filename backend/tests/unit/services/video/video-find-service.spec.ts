import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoFindService } from '#services/video/video-find-service'
import { mockFakeVideoModel } from '#tests/factories/fakes/index'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const sut = new VideoFindService(videoRepositoryStub)

  return { sut, videoRepositoryStub }
}

test.group('VideoFindService.find()', () => {
  test('should return an video on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.find(faker.string.uuid())

    expect(video).toEqual(createSuccessResponse(mockFakeVideoModel()))
  })

  test('should return an error if a video not found', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').resolves(null)
    const video = await sut.find(faker.string.uuid())

    expect(video).toEqual(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND))
  })
})
