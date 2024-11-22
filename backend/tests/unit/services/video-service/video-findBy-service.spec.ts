import { test } from '@japa/runner'
import { VideoService } from '#services/video-service'
import { createSuccessResponse } from '#helpers/method-response'
import _ from 'lodash'
import { makeAuthServiceStub } from '#tests/factories/stubs/makeAuthServiceStub'
import { makeVideoRepositoryStub } from '#tests/factories/stubs/makeVideoRepositoryStub'

const makeSut = () => {
  const videoRepositoryStub = makeVideoRepositoryStub()
  const authServiceStub = makeAuthServiceStub()
  const sut = new VideoService(videoRepositoryStub, authServiceStub)

  return { sut, videoRepositoryStub, authServiceStub }
}

test.group('VideoService.findBy()', () => {
  test('should returns a empty list of videos with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const video = await sut.findBy({})

    expect(video).toEqual(createSuccessResponse([]))
  })

  test('should returns a list videos returns on find by genrer', async ({ expect }) => {
    const { sut } = makeSut()
    const video = await sut.findBy({ genrerId: 0 })

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
      userUuid: 'any_uuid',
    })

    expect(video).toEqual(createSuccessResponse([]))
  })
})
