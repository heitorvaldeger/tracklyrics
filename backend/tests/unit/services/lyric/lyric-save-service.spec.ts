import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { LyricSaveService } from '#services/lyric/lyric-save-service'
import { mockLyricRepositoryStub } from '#tests/factories/stubs/repository/mock-lyric-repository-stub'
import { mockVideoRepositoryStub } from '#tests/factories/stubs/repository/mock-video-repository-stub'
import { mockVideoCurrentUserServiceStub } from '#tests/factories/stubs/services/mock-video-current-user-service-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const videoCurrentUserServiceStub = mockVideoCurrentUserServiceStub()
  const lyricRepositoryStub = mockLyricRepositoryStub()
  const sut = new LyricSaveService(
    videoRepositoryStub,
    videoCurrentUserServiceStub,
    lyricRepositoryStub
  )

  return {
    sut,
    videoRepositoryStub,
    videoCurrentUserServiceStub,
    lyricRepositoryStub,
  }
}

const paramsToInsert = {
  videoUuid: 'any_uuid',
  lyrics: [
    {
      startTime: 'any_start_time',
      endTime: 'any_end_time',
      line: 'any_line',
    },
    {
      startTime: 'other_start_time',
      endTime: 'other_end_time',
      line: 'other_line',
    },
  ],
}

test.group('LyricSaveService', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return success if a lyric was save with success', async ({ expect }) => {
    const { sut } = makeSut()
    const response = await sut.save({
      videoUuid: 'any_uuid',
      lyrics: [
        {
          startTime: 'any_start_time',
          endTime: 'any_end_time',
          line: 'any_line',
        },
      ],
    })

    expect(response).toEqual(
      createSuccessResponse({
        countLyricsInserted: 2,
      })
    )
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByCurrentUser').returns(Promise.resolve(true))
    const response = await sut.save(paramsToInsert)

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return an error if videoId not exist', async ({ expect }) => {
    const { sut, videoRepositoryStub } = makeSut()
    stub(videoRepositoryStub, 'getVideoId').returns(Promise.resolve(null))
    const response = await sut.save(paramsToInsert)

    expect(response).toEqual(createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('call LyricRepository save with correct values', async ({ expect }) => {
    const { sut, lyricRepositoryStub } = makeSut()
    const lyricInsertSpy = stub(lyricRepositoryStub, 'save')
    await sut.save(paramsToInsert)

    expect(
      lyricInsertSpy.calledWith([
        {
          startTime: 'any_start_time',
          endTime: 'any_end_time',
          line: 'any_line',
          seq: 1,
          videoId: 1,
        },
        {
          startTime: 'other_start_time',
          endTime: 'other_end_time',
          line: 'other_line',
          seq: 2,
          videoId: 1,
        },
      ])
    ).toBeTruthy()
  })
})
