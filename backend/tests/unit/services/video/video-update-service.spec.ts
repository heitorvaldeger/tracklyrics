import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoUpdateService } from '#services/video/video-update-service'
import { mockAuthStrategy } from '#tests/factories/mocks/mock-auth-strategy'
import { mockVideoRequest } from '#tests/factories/mocks/mock-video-request'
import { mockGenreRepositoryStub } from '#tests/factories/stubs/repository/mock-genre-repository-stub'
import { mockLanguageRepositoryStub } from '#tests/factories/stubs/repository/mock-language-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/factories/stubs/services/mock-video-current-user-service-stub'

const videoRequest = mockVideoRequest()

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authStrategyStub = mockAuthStrategy()
  const genreRepositoryStub = mockGenreRepositoryStub()
  const languageRepositoryStub = mockLanguageRepositoryStub()
  const videoCurrentUserServiceStub = mockVideoCurrentUserServiceStub()
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
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(videoRequest, faker.string.uuid())

    expect(updated).toEqual(createSuccessResponse(true))
  })

  test('should return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(0)
    await sut.update(videoRequest, faker.string.uuid())

    expect(authStrategyStub.getUserId.returned(0)).toBeTruthy()
  })

  test('should returns a error if link youtube already exists on update', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const video = await sut.update(videoRequest, faker.string.uuid())
    expect(video).toEqual(createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS))
  })

  test('should returns a error if video not exists', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const video = await sut.update(videoRequest, faker.string.uuid())

    expect(video).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('should return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.GENRE_NOT_FOUND))
  })

  test('should return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.LANGUAGE_NOT_FOUND))
  })
})
