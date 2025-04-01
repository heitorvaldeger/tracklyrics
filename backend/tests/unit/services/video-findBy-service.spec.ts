import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import _ from 'lodash'

import { VideoFindService } from '#services/video-find-service'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockFavoriteRepository } from '#tests/__mocks__/stubs/mock-favorite-stub'
import { mockVideoData, mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const { authStub } = mockAuth()
  const sut = new VideoFindService(authStub, mockVideoRepository, mockFavoriteRepository)

  return { sut }
}

test.group('VideoFindService.findBy()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a empty list of videos with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.findBy({})

    expect(video).toEqual([mockVideoData])
  })

  test('return a list videos returns on find by genre', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ genreId: 0 })

    expect(video).toEqual([mockVideoData])
  })

  test('return a list videos returns on find by language', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ languageId: 0 })

    expect(video).toEqual([mockVideoData])
  })

  test('return a list videos returns on find by user uuid', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({
      userUuid: faker.string.uuid(),
    })

    expect(video).toEqual([mockVideoData])
  })
})
