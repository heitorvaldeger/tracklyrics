import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { createSuccessResponse, createFailureResponse } from '#helpers/method-response'
import { VideoCreateService } from '#services/video/video-create-service'
import { mockFakeVideoSaveResultModel } from '#tests/factories/fakes/index'
import { mockVideoRequest } from '#tests/factories/fakes/mock-video-request'
import { mockAuthServiceStub } from '#tests/factories/stubs/services/mock-auth-service-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { test } from '@japa/runner'
import { stub, spy } from 'sinon'
import { mockGenreRepositoryStub } from '#tests/factories/stubs/repository/mock-genre-repository-stub'
import { mockLanguageRepositoryStub } from '#tests/factories/stubs/repository/mock-language-repository-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()

  const authServiceStub = mockAuthServiceStub()
  const sut = new VideoCreateService(
    videoRepositoryStub,
    authServiceStub,
    genreRepositoryStub,
    languageRepositoryStub
  )

  return { sut, videoRepositoryStub, authServiceStub, genreRepositoryStub, languageRepositoryStub }
}

test.group('Video Create Service', () => {
  test('should return success if a video created on success', async ({ expect }) => {
    const { sut } = makeSut()
    const videoResponse = await sut.create(mockVideoRequest())

    expect(videoResponse).toEqual(createSuccessResponse(mockFakeVideoSaveResultModel()))
  })

  test('should return userId valid on call AuthService getUserId', async ({ expect }) => {
    const { sut, authServiceStub } = makeSut()
    const getUserIdSpy = spy(authServiceStub, 'getUserId')
    await sut.create(mockVideoRequest())

    expect(getUserIdSpy.returned(0)).toBeTruthy()
  })

  test('should return an error if link youtube already exists', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const videoResponse = await sut.create(mockVideoRequest())
    expect(videoResponse).toEqual(
      createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    )
  })

  test('should return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(mockVideoRequest())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_ERRORS.GENRE_NOT_FOUND))
  })

  test('should return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.create(mockVideoRequest())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_ERRORS.LANGUAGE_NOT_FOUND))
  })
})
