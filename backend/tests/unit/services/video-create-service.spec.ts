import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { VideoCreateService } from '#services/video-create-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockFakeVideoSaveResultModel } from '#tests/__mocks__/mock-video-save-result-model'
import { mockAuth } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockGenreRepository } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepository } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockLyricRepository } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepository } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const { authStub } = mockAuth()

  const sut = new VideoCreateService(
    mockVideoRepository,
    authStub,
    mockGenreRepository,
    mockLanguageRepository,
    mockLyricRepository
  )

  return { sut, authStub }
}

test.group('Video Create Service', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(mockVideoCreateOrUpdateRequest)

    expect(videoResponse).toEqual(mockFakeVideoSaveResultModel())
  })

  test('return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authStub } = makeSut()
    authStub.getUserId.returns(0)
    await sut.create(mockVideoCreateOrUpdateRequest)

    expect(authStub.getUserId.returned(0)).toBeTruthy()
  })

  test('return an error if link youtube already exists', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockVideoRepository, 'hasYoutubeLink').resolves(true)
    const videoResponse = sut.create(mockVideoCreateOrUpdateRequest)
    expect(videoResponse).rejects.toEqual(new YoutubeLinkAlreadyExistsException())
  })

  test('return an error if genre not exist', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockGenreRepository, 'findById').resolves(null)
    const videoResponse = sut.create(mockVideoCreateOrUpdateRequest)
    expect(videoResponse).rejects.toEqual(new GenreNotFoundException())
  })

  test('return an error if language not exist', async ({ expect }) => {
    const { sut } = makeSut()
    stub(mockLanguageRepository, 'findById').resolves(null)
    const videoResponse = sut.create(mockVideoCreateOrUpdateRequest)
    expect(videoResponse).rejects.toEqual(new LanguageNotFoundException())
  })
})
