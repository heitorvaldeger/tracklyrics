import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import LyricFindController from '#controllers/lyric-find-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { LyricFindProtocolService } from '#services/_protocols/lyric/lyric-find-protocol-service'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const lyrics = [
  {
    seq: 0,
    startTime: '00:00:00',
    endTime: '00:00:00',
    line: 'any_line',
  },
]

const mockLyricFindServiceStub = (): LyricFindProtocolService => ({
  find: (videoUuid: string) => Promise.resolve(lyrics),
})

const videoUuid = randomUUID()

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: videoUuid,
    }
  )

  const lyricFindServiceStub = mockLyricFindServiceStub()
  const sut = new LyricFindController(lyricFindServiceStub)

  return { sut, httpContext, lyricFindServiceStub }
}

test.group('LyricFindController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(context.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.find(context)

    expect(context.response.getStatus()).toBe(400)
    expect(context.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()
    stub(lyricFindServiceStub, 'find').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.find(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 on video lyrics find with success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.find(httpContext)
    expect(httpResponse).toEqual(lyrics)
  })

  test('return 500 if lyrics find throws', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()

    stub(lyricFindServiceStub, 'find').throws(new Error())

    const httpResponse = sut.find(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })

  test('call LyricFindService with correct values', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()
    const findSpy = stub(lyricFindServiceStub, 'find')

    await sut.find(httpContext)

    expect(findSpy.calledWith(videoUuid)).toBeTruthy()
  })
})
