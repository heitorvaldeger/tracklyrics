import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { VideoUpdateService } from '#services/video-update-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockGenreRepositoryStub } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedServiceStub } from '#tests/__mocks__/stubs/mock-video-stub'

const videoRequest = mockVideoCreateOrUpdateRequest()

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const videoCurrentUserServiceStub = mockVideoUserLoggedServiceStub()
  const sut = new VideoUpdateService(
    videoRepositoryStub,
    authStrategyStub,
    videoCurrentUserServiceStub,
    genreRepositoryStub,
    languageRepositoryStub
  )

  return {
    sut,
    videoRepositoryStub,
    authStrategyStub,
    videoCurrentUserServiceStub,
    genreRepositoryStub,
    languageRepositoryStub,
  }
}

test.group('Video Update Service', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(videoRequest, faker.string.uuid())

    expect(updated).toBeTruthy()
  })

  test('return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(0)
    await sut.update(videoRequest, faker.string.uuid())

    expect(authStrategyStub.getUserId.returned(0)).toBeTruthy()
  })

  test('returns a error if link youtube already exists on update', ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const videoResponse = sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new YoutubeLinkAlreadyExistsException())
  })

  test('returns a error if video not exists', ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
    const video = sut.update(videoRequest, faker.string.uuid())

    expect(video).rejects.toEqual(new VideoNotFoundException())
  })

  test('return an error if genre not exist', ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new GenreNotFoundException())
  })

  test('return an error if language not exist', ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).rejects.toEqual(new LanguageNotFoundException())
  })
})
