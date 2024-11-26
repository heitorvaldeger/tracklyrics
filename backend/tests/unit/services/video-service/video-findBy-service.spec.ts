import { test } from '@japa/runner'
import { VideoService } from '#services/video-service'
import { createSuccessResponse } from '#helpers/method-response'
import _ from 'lodash'
import { mockAuthServiceStub } from '#tests/factories/stubs/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/mock-video-repository-stub'
import { faker } from '@faker-js/faker'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.findBy()', () => {
  test('should returns a empty list of videos with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.findBy({})

    expect(video).toEqual(createSuccessResponse([]))
  })

  test('should returns a list videos returns on find by genre', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ genreId: 0 })

    expect(video).toEqual(createSuccessResponse([]))
  })

  test('should returns a list videos returns on find by language', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ languageId: 0 })

    expect(video).toEqual(createSuccessResponse([]))
  })

  test('should returns a list videos returns on find by user uuid', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({
      userUuid: faker.string.uuid(),
    })

    expect(video).toEqual(createSuccessResponse([]))
  })
})
