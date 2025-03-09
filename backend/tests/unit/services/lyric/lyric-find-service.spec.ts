import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { LyricFindService } from '#services/lyric/lyric-find-service'
import {
  mockLyricFindResponseData,
  mockLyricRepositoryStub,
} from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const lyricRepositoryStub = mockLyricRepositoryStub()
  const sut = new LyricFindService(videoRepositoryStub, lyricRepositoryStub)

  return {
    sut,
    videoRepositoryStub,
    lyricRepositoryStub,
  }
}

test.group('LyricFindService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return a lyrics list with success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.find('any_uuid')

    expect(response).toEqual(createSuccessResponse(mockLyricFindResponseData))
  })

  test('return an error if videoId not exist', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'getVideoId').returns(Promise.resolve(null))
    const response = await sut.find('any_uuid')

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('call LyricRepository find with correct value', async ({ expect }) => {
    const { sut, lyricRepositoryStub } = makeSut()
    const lyricInsertSpy = stub(lyricRepositoryStub, 'find')
    await sut.find('any_uuid')

    expect(lyricInsertSpy.calledWith(1)).toBeTruthy()
  })

  test('call VideoRepository getVideoId with correct value', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    const lyricInsertSpy = stub(videoRepositoryStub, 'getVideoId')
    await sut.find('any_uuid')

    expect(lyricInsertSpy.calledWith('any_uuid')).toBeTruthy()
  })
})
