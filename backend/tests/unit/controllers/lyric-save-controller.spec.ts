import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import Sinon, { stub } from 'sinon'

import LyricSaveController from '#controllers/lyric-save-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricSaveProtocolService } from '#services/_protocols/lyric/lyric-save-protocol-service'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const mockLyricSaveServiceStub = (): LyricSaveProtocolService => ({
  save: (params: LyricSaveProtocolService.LyricParamsToInsert) =>
    Promise.resolve({
      countLyricsInserted: 1,
    }),
})

const lyrics = [
  {
    startTime: '00:00.00',
    endTime: '00:00.00',
    line: 'any_lyric',
  },
  {
    startTime: '00:00.00',
    endTime: '00:00.00',
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
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.save(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('return 400 if invalid params inside body is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'body').returns([
      {
        startTime: 'invalid_time',
        endTime: 'invalid_time',
        line: '',
      },
    ])

    await sut.save(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'line',
        message: 'The line field must have at least 1 characters',
      },
      {
        field: 'startTime',
        message: 'The startTime field must be in the format MM:SS.ss',
      },
      {
        field: 'endTime',
        message: 'The endTime field must be in the format MM:SS.ss',
      },
    ])
  })

  test('return 400 if any lyric provided with startTime is more then endTime', async ({
    expect,
  }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'body').returns([
      {
        startTime: '00:00.10',
        endTime: '00:00.00',
        line: 'any_line',
      },
    ])

    await sut.save(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'startTime',
        message: 'The startTime field must be less than the endTime field',
      },
    ])
  })

  test('return 400 if body provided is not array', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'body').returns({})

    await sut.save(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: '',
        message: 'The data field must be an array',
      },
    ])
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()
    stub(lyricSaveServiceStub, 'save').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.save(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 if video save with success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.save(httpContext)
    expect(httpResponse).toEqual({
      countLyricsInserted: 1,
    })
  })

  test('return 200 on video save if seconds in startTime is more than seconds in endTime', async ({
    expect,
  }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'body').returns([
      {
        startTime: '00:02.10',
        endTime: '00:03.00',
        line: 'any_lyric',
      },
    ])

    const httpResponse = await sut.save(ctx)
    expect(ctx.response.getStatus()).toBe(200)
    expect(httpResponse).toEqual({
      countLyricsInserted: 1,
    })
  })

  test('return 500 if video save throws', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()

    stub(lyricSaveServiceStub, 'save').throws(new Error())

    const httpResponse = sut.save(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })

  test('call LyricSaveService with correct values', async ({ expect }) => {
    const { sut, httpContext, lyricSaveServiceStub } = await makeSut()
    const saveSpy = Sinon.spy(lyricSaveServiceStub, 'save')

    await sut.save(httpContext)

    expect(
      saveSpy.calledWith({
        lyrics,
        videoUuid,
      })
    ).toBeTruthy()
  })
})
