import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoDeleteService } from '#services/video-delete-service'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedServiceStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const videoCurrentUserServiceStub = mockVideoUserLoggedServiceStub()
  const sut = new VideoDeleteService(videoRepositoryStub, videoCurrentUserServiceStub)

  return { sut, videoRepositoryStub, videoCurrentUserServiceStub }
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
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').resolves(true)
    const response = sut.delete(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })

  test('it must return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').resolves(true)
    const response = sut.delete(faker.string.uuid())

    expect(response).rejects.toEqual(new VideoNotFoundException())
  })
})
