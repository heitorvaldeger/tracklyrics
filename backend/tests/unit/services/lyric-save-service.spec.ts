import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { LyricSaveService } from '#services/lyric-save-service'
import { mockLyricRepositoryStub } from '#tests/__mocks__/stubs/mock-lyric-stub'
import { mockVideoRepositoryStub } from '#tests/__mocks__/stubs/mock-video-stub'
import { mockVideoUserLoggedServiceStub } from '#tests/__mocks__/stubs/mock-video-stub'

const makeSut = () => {
  const videoRepositoryStub = mockVideoRepositoryStub()
  const videoCurrentUserServiceStub = mockVideoUserLoggedServiceStub()
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
      startTime: '00:00:00',
      endTime: '00:00:10',
      line: 'any_line',
    },
    {
      startTime: '00:00:10',
      endTime: '00:00:15',
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
    const response = await sut.save(paramsToInsert)

    expect(response).toEqual(
      createSuccessResponse({
        countLyricsInserted: 2,
      })
    )
  })

  test('return an error if video not belong from user', async ({ expect }) => {
    const { sut, videoCurrentUserServiceStub } = makeSut()
    stub(videoCurrentUserServiceStub, 'isNotVideoOwnedByUserLogged').returns(Promise.resolve(true))
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
          ...paramsToInsert.lyrics[0],
          seq: 1,
          videoId: 1,
        },
        {
          ...paramsToInsert.lyrics[1],
          seq: 2,
          videoId: 1,
        },
      ])
    ).toBeTruthy()
  })
})
