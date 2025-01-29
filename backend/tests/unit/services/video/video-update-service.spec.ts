import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { VideoUpdateService } from '#services/video/video-update-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { mockAuthStrategyStub } from '#tests/__mocks__/stubs/mock-auth-strategy-stub'
import { mockGenreRepositoryStub } from '#tests/__mocks__/stubs/mock-genre-stub'
import { mockLanguageRepositoryStub } from '#tests/__mocks__/stubs/mock-language-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/__mocks__/stubs/mock-video-stub'

const videoRequest = mockVideoCreateOrUpdateRequest()

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const authStrategyStub = mockAuthStrategyStub()
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
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a video updated with success', async ({ expect }) => {
    const { sut } = makeSut()
    const updated = await sut.update(videoRequest, faker.string.uuid())

    expect(updated).toEqual(createSuccessResponse(true))
  })

  test('return userId valid on call AuthService.getUserId', async ({ expect }) => {
    const { sut, authStrategyStub } = makeSut()
    authStrategyStub.getUserId.returns(0)
    await sut.update(videoRequest, faker.string.uuid())

    expect(authStrategyStub.getUserId.returned(0)).toBeTruthy()
  })

  test('returns a error if link youtube already exists on update', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'hasYoutubeLink').resolves(true)
    const video = await sut.update(videoRequest, faker.string.uuid())
    expect(video).toEqual(createFailureResponse(APPLICATION_MESSAGES.YOUTUBE_LINK_ALREADY_EXISTS))
  })

  test('returns a error if video not exists', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const video = await sut.update(videoRequest, faker.string.uuid())

    expect(video).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return an error if genre not exist', async ({ expect }) => {
    const { sut, genreRepositoryStub } = makeSut()
    stub(genreRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.GENRE_NOT_FOUND))
  })

  test('return an error if language not exist', async ({ expect }) => {
    const { sut, languageRepositoryStub } = makeSut()
    stub(languageRepositoryStub, 'findById').resolves(null)
    const videoResponse = await sut.update(videoRequest, faker.string.uuid())
    expect(videoResponse).toEqual(createFailureResponse(APPLICATION_MESSAGES.LANGUAGE_NOT_FOUND))
  })
})
