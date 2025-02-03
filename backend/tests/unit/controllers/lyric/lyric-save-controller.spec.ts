import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import LyricSaveController from '#controllers/lyric/lyric-save-controller'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { LyricSaveProtocolService } from '#services/protocols/lyric/lyric-save-protocol-service'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const mockLyricSaveServiceStub = (): LyricSaveProtocolService => ({
  save: (params: LyricSaveProtocolService.LyricParamsToInsert) =>
    Promise.resolve(
      createSuccessResponse({
        countLyricsInserted: 1,
      })
    ),
})

const lyrics = [
  {
    startTime: '00:00:00',
    endTime: '00:00:00',
    line: 'any_lyric',
  },
  {
    startTime: '00:00:00',
    endTime: '00:00:00',
    line: 'any_lyric',
  },
]
const videoUuid = randomUUID()

const makeSut = async () => {
  const httpContext = makeHttpRequest(lyrics, {
    uuid: videoUuid,
  })

  const lyricSaveServiceStub = mockLyricSaveServiceStub()
  const sut = new LyricSaveController(lyricSaveServiceStub)

  return { sut, httpContext, lyricSaveServiceStub }
}

test.group('LyricSaveController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('return 400 if invalid params inside body is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'body').returns([
      {
        startTime: 'invalid_time',
        endTime: 'invalid_time',
        line: '',
      },
    ])

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'line',
          message: 'The line field must have at least 1 characters',
        },
        {
          field: 'startTime',
          message: 'The startTime field must be pattern 00:00:00',
        },
        {
          field: 'endTime',
          message: 'The endTime field must be pattern 00:00:00',
        },
      ])
    )
  })

  test('return 400 if any line with startTime more then endTime is provided', async ({
    expect,
  }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'body').returns([
      {
        startTime: '00:00:10',
        endTime: '00:00:00',
        line: 'any_line',
      },
    ])

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'startTime',
          message: 'The startTime field must be less than the endTime field',
        },
      ])
    )
  })

  test('return 400 if body provided is not array', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'body').returns({})

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: '',
          message: 'The data field must be an array',
        },
      ])
    )
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()
    stub(lyricSaveServiceStub, 'save').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return 200 if video save with success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.save(httpContext)
    expect(httpResponse).toEqual(
      ok({
        countLyricsInserted: 1,
      })
    )
  })

  test('return 500 if video save throws', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()

    stub(lyricSaveServiceStub, 'save').throws(new Error())

    const httpResponse = await sut.save(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('call LyricSaveService with correct values', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()
    const saveSpy = stub(lyricSaveServiceStub, 'save')

    await sut.save(httpContext)

    expect(
      saveSpy.calledWith({
        lyrics,
        videoUuid,
      })
    ).toBeTruthy()
  })
})
