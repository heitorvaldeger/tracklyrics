import { test } from '@japa/runner'
import { spy, stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoCreateService } from '#services/video/video-create-service'
import { mockAuthStrategy } from '#tests/factories/mocks/mock-auth-strategy'
import { mockVideoRequest } from '#tests/factories/mocks/mock-video-request'
import { mockFakeVideoSaveResultModel } from '#tests/factories/mocks/mock-video-save-result-model'
import { mockGenreRepositoryStub } from '#tests/factories/stubs/repository/mock-genre-repository-stub'
import { mockLanguageRepositoryStub } from '#tests/factories/stubs/repository/mock-language-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'

const videoRequest = mockVideoRequest()
const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const authStrategyStub = mockAuthStrategy()

  const sut = new VideoCreateService(
    videoRepositoryStub,
    authStrategyStub,
    genreRepositoryStub,
    languageRepositoryStub
  )

  return { sut, videoRepositoryStub, authStrategyStub, genreRepositoryStub, languageRepositoryStub }
}

test.group('Video Create Service', () => {
  test('it must return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(videoRequest)

    expect(videoResponse).toEqual(createSuccessResponse(mockFakeVideoSaveResultModel()))
  })

  test('it must return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(0)
    await sut.create(videoRequest)

    expect(authStrategyStub.getUserId.returned(0)).toBeTruthy()
  })

  test('it must return an error if link youtube already exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(
      createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS)
    )
  })

  test('it must return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.GENRE_NOT_FOUND))
  })

  test('it must return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(videoRequest)
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.LANGUAGE_NOT_FOUND))
  })
})
