import { test } from '@japa/runner'
import { spy, stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoCreateService } from '#services/video-create-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockFakeVideoSaveResultModel } from '#tests/__mocks__/mock-video-save-result-model'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockGenreRepositoryStub } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const videoRequest = mockVideoCreateOrUpdateRequest()

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const { authStrategyStub } = mockAuthStrategyStub()

  const sut = new VideoCreateService(
    videoRepositoryStub,
    authStrategyStub,
    genreRepositoryStub,
    languageRepositoryStub
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

    expect(videoResponse).toEqual(createSuccessResponse(mockFakeVideoSaveResultModel()))
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
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
    )
  })

  test('return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.GENRE_NOT_FOUND))
  })

  test('return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.LANGUAGE_NOT_FOUND))
  })
})
