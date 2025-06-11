import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import UpdateVideoController from '#controllers/video/UpdateVideoController'
import ValidationException from '#exceptions/ValidationException'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { IVideoUpdateService } from '#services/interfaces/video-update-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const mockVideoUpdateServiceStub = (): IVideoUpdateService => ({
  update: (_payload: IVideoUpdateService.Params, _uuid: string) => Promise.resolve(true),
})

const makeSut = async () => {
  const httpContext = makeHttpRequest(mockVideoCreateOrUpdateRequest, {
    uuid: randomUUID(),
  })

  const videoUpdateServiceStub = mockVideoUpdateServiceStub()
  const sut = new UpdateVideoController(videoUpdateServiceStub, validatorSchema, validatorSchema)

  return { sut, httpContext, videoUpdateServiceStub }
}

test.group('UpdateVideoController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })
  test('return a Validator exception if an invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(ctx)

    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 400 if isDraft is not boolean', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request.body(), 'isDraft').value('any_value')
    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'isDraft',
        message: 'The value must be a boolean',
      },
    ])
  }).skip()

  test('return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request, 'body').returns({
      isDraft: false,
    })

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'title',
        message: 'The title field must be defined',
      },
      {
        field: 'artist',
        message: 'The artist field must be defined',
      },
      {
        field: 'releaseYear',
        message: 'The releaseYear field must be defined',
      },
      {
        field: 'linkYoutube',
        message: 'The linkYoutube field must be defined',
      },
      {
        field: 'languageId',
        message: 'The languageId field must be defined',
      },
      {
        field: 'genreId',
        message: 'The genreId field must be defined',
      },
    ])
  }).skip()

  test('return 400 if lyrics is not array', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'lyrics').value([
      {
        startTime: 'invalid_time',
        endTime: 'invalid_time',
        line: '',
      },
    ])

    await sut.handle(ctx)

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
  }).skip()

  test('return 400 if fields in lyrics are invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'lyrics').value({})

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'lyrics',
        message: 'The lyrics field must be an array',
      },
    ])
  }).skip()

  test('return 400 if any lyric provided with startTime is more then endTime', async ({
    expect,
  }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request.body(), 'lyrics').value([
      {
        startTime: '00:00.10',
        endTime: '00:00.00',
        line: 'any_line',
      },
    ])

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'startTime',
        message: 'The startTime field must be less than the endTime field',
      },
    ])
  }).skip()

  test('return 400 if releseYear not contains four length', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('00000')

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field must be 4 characters long',
      },
    ])
  }).skip()

  test('return 400 if releseYear is not string numeric', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('abcd')

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field format is invalid',
      },
    ])
  }).skip()

  test('return 400 if fields not contains most three characteres', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: 'ab',
      artist: 'ab',
    })

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'title',
        message: 'The title field must have at least 3 characters',
      },
      {
        field: 'artist',
        message: 'The artist field must have at least 3 characters',
      },
    ])
  }).skip()

  test('return 400 if fields are empty', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: '',
      artist: '',
      releaseYear: '',
    })

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'title',
        message: 'The title field must have at least 3 characters',
      },
      {
        field: 'artist',
        message: 'The artist field must have at least 3 characters',
      },
      {
        field: 'releaseYear',
        message: 'The releaseYear field must be 4 characters long',
      },
    ])
  }).skip()

  test('return 400 if linkYoutube is not link valid', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'linkYoutube').value('any_link')

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'linkYoutube',
        message: 'The linkYoutube field format is invalid',
      },
    ])
  }).skip()

  test('return 400 if invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.handle(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  }).skip()

  test('return 404 if a video return not found', async ({ expect }) => {
    const { sut, httpContext, videoUpdateServiceStub } = await makeSut()
    stub(videoUpdateServiceStub, 'update').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new VideoNotFoundException())
  })

  test('return 200 if video updated on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    const httpResponse = await sut.handle(ctx)
    expect(httpResponse).toBeTruthy()
  })

  test('return 500 if video update throws', async ({ expect }) => {
    const { sut, httpContext: ctx, videoUpdateServiceStub } = await makeSut()

    stub(videoUpdateServiceStub, 'update').throws(new Error())

    const httpResponse = sut.handle(ctx)

    await expect(httpResponse).rejects.toThrow(new Error())
  })
})
