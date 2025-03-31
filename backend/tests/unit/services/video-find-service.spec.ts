import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'
import { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoFindService } from '#services/video-find-service'
import { mockVideoData, mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const sut = new VideoFindService(mockVideoRepository)

  return { sut }
}

test.group('VideoFindService.find()', () => {
  test('it must return an video on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.find(faker.string.uuid())

    expect(video).toEqual(mockVideoData)
    expect(video).toEqual(
      expect.objectContaining({
        uuid: expect.any(String),
        title: expect.any(String),
        artist: expect.any(String),
        linkYoutube: expect.any(String),
        thumbnail: expect.any(String),
        releaseYear: expect.any(String),
        language: expect.any(String),
        genre: expect.any(String),
        username: expect.any(String),
        isFavorite: expect.any(Boolean),
      })
    )
  })

  test('it must return an error if a video not found', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'find').resolves(null)
    const video = sut.find(faker.string.uuid())

    expect(video).rejects.toEqual(new VideoNotFoundException())
  })
})
