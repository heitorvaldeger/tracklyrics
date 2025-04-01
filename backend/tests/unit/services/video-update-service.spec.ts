import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { VideoUpdateService } from '#services/video-update-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-stub'
import { mockGenreRepository } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepository } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockLyricRepository } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedService } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const { authStub } = mockAuth()

  const sut = new VideoUpdateService(
    mockVideoRepository,
    authStub,
    mockVideoUserLoggedService,
    mockGenreRepository,
    mockLanguageRepository,
    mockLyricRepository
  )

  return {
    sut,
    authStub,
  }
}

test.group('Video Update Service', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())

    expect(updated).toBeTruthy()
  })

  test('return video updated with success if another youtube URL provided is valid', async ({
    expect,
  }) => {
    const uuid = faker.string.uuid()
    const { sut } = makeSut()
    stub(mockVideoRepository, 'getVideoUuidByYoutubeURL').resolves(uuid)

    const updated = await sut.update(mockVideoCreateOrUpdateRequest, uuid)

    expect(updated).toBeTruthy()
  })

  test('return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authStub } = makeSut()
    authStub.getUserId.returns(0)
    await sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())

    expect(authStub.getUserId.returned(0)).toBeTruthy()
  })

  test("return an error if youtube URL video provided already exists and doesn't belong the video provided", ({
    expect,
  }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'getVideoUuidByYoutubeURL').resolves('any_uuid')
    const videoResponse = sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new YoutubeLinkAlreadyExistsException())
  })

  test('return a error if video not exists', ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoUserLoggedService, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
    const video = sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())

    expect(video).rejects.toEqual(new VideoNotFoundException())
  })

  test('return an error if genre not exist', ({ expect }) => {
    const { sut } = makeSut()
    stub(mockGenreRepository, 'findById').resolves(null)
    const videoResponse = sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new GenreNotFoundException())
  })

  test('return an error if language not exist', ({ expect }) => {
    const { sut } = makeSut()
    stub(mockLanguageRepository, 'findById').resolves(null)
    const videoResponse = sut.update(mockVideoCreateOrUpdateRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new LanguageNotFoundException())
  })
})
