import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'

import { createSuccessResponse } from '#helpers/method-response'
import { VideoFindService } from '#services/video/video-find-service'
import {
  mockVideoData,
  mockVideoDataWithoutThumbnail,
  mockVideoRepositoryStub,
} from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const sut = new VideoFindService(videoRepositoryStub)

  return { sut, videoRepositoryStub }
}

test.group('VideoFindService.findBy()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('returns a empty list of videos with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.findBy({})

    expect(video).toEqual(createSuccessResponse([mockVideoData]))
  })

  test('returns a list videos returns on find by genre', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ genreId: 0 })

    expect(video).toEqual(createSuccessResponse([mockVideoData]))
  })

  test('returns a list videos returns on find by language', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ languageId: 0 })

    expect(video).toEqual(createSuccessResponse([mockVideoData]))
  })

  test('returns a list videos returns on find by user uuid', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({
      userUuid: faker.string.uuid(),
    })

    expect(video).toEqual(createSuccessResponse([mockVideoData]))
  })
})
