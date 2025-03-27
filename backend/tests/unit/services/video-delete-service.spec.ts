import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoDeleteService } from '#services/video-delete-service'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedService } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const sut = new VideoDeleteService(mockVideoRepository, mockVideoUserLoggedService)

  return { sut }
}

test.group('Video Delete Service', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('it must return success if a video deleted on success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.delete(faker.string.uuid())

    expect(response).toBeTruthy()
  })

  test('it must return an error if video not exists', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'isNotVideoOwnedByUserLogged').resolves(true)
    const response = sut.delete(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('it must return an error if video not belong from user', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'isNotVideoOwnedByUserLogged').resolves(true)
    const response = sut.delete(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })
})
