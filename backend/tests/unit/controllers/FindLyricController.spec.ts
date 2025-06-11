import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import FindLyricController from '#controllers/FindLyricsByVideoUUIDController'
import ValidationException from '#exceptions/ValidationException'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { ILyricFindService } from '#services/interfaces/lyric-find-service'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const lyrics = [
  {
    seq: 0,
    startTime: '00:00.00',
    endTime: '00:00.00',
    line: 'any_line',
  },
]

const mockLyricFindServiceStub = (): ILyricFindService => ({
  find: () => Promise.resolve(lyrics),
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
  const sut = new FindLyricController(lyricFindServiceStub, validatorSchema)

  return { sut, httpContext, lyricFindServiceStub }
}

test.group('FindLyricController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return an exception if Validation throws', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()

    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))
    stub(context.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const promise = sut.handle(context)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()
    stub(lyricFindServiceStub, 'find').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new VideoNotFoundException())
  })

  test('return 200 on video lyrics find with success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.handle(httpContext)
    expect(httpResponse).toEqual(lyrics)
  })

  test('return an exception if lyrics find throws', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()

    stub(lyricFindServiceStub, 'find').throws(new Error())

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new Error())
  })

  test('call LyricFindService with correct values', async ({ expect }) => {
    const { sut, httpContext, lyricFindServiceStub } = await makeSut()
    const findSpy = stub(lyricFindServiceStub, 'find')

    await sut.handle(httpContext)

    expect(findSpy.calledWith(videoUuid)).toBeTruthy()
  })
})
