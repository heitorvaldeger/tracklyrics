import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoFindService } from '#services/video-find-service'
import { mockVideoData, mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const sut = new VideoFindService(videoRepositoryStub)

  return { sut, videoRepositoryStub }
}

test.group('VideoFindService.find()', () => {
  test('it must return an video on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.find(faker.string.uuid())

    expect(video).toEqual(mockVideoData)
  })

  test('it must return an error if a video not found', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'find').resolves(null)
    const video = sut.find(faker.string.uuid())

    expect(video).rejects.toEqual(new VideoNotFoundException())
  })
})
