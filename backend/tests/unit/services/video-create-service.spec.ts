import { test } from '@japa/runner'
import { stub } from 'sinon'

import GenreNotFoundException from '#exceptions/genre-not-found-exception'
import LanguageNotFoundException from '#exceptions/language-not-found-exception'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { VideoCreateService } from '#services/video-create-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockFakeVideoSaveResultModel } from '#tests/__mocks__/mock-video-save-result-model'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockGenreRepositoryStub } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockLyricRepositoryStub } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const videoRequest = mockVideoCreateOrUpdateRequest()

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const lyricRepositoryStub = mockLyricRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()

  const sut = new VideoCreateService(
    videoRepositoryStub,
    authStrategyStub,
    genreRepositoryStub,
    languageRepositoryStub,
    lyricRepositoryStub
  )

  return { sut, videoRepositoryStub, authStrategyStub, genreRepositoryStub, languageRepositoryStub }
}

test.group('Video Create Service', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(videoRequest)

    expect(videoResponse).toEqual(mockFakeVideoSaveResultModel())
  })

  test('return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(0)
    await sut.create(videoRequest)

    expect(authStrategyStub.getUserId.returned(0)).toBeTruthy()
  })

  test('return an error if link youtube already exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const videoResponse = sut.create(videoRequest)
    expect(videoResponse).rejects.toEqual(new YoutubeLinkAlreadyExistsException())
  })

  test('return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = sut.create(videoRequest)
    expect(videoResponse).rejects.toEqual(new GenreNotFoundException())
  })

  test('return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = sut.create(videoRequest)
    expect(videoResponse).rejects.toEqual(new LanguageNotFoundException())
  })
})
