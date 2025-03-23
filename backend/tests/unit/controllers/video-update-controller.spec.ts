import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import VideoUpdateController from '#controllers/video-update-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { VideoUpdateProtocolService } from '#services/_protocols/video/video-update-protocol-service'
import { mockVideoCreateOrUpdateRequest } from '#tests/__mocks__/mock-video-request'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const mockVideoUpdateServiceStub = (): VideoUpdateProtocolService => ({
  update: (_payload: VideoUpdateProtocolService.Params, _uuid: string) => Promise.resolve(true),
})

const makeSut = async () => {
  const httpContext = makeHttpRequest(mockVideoCreateOrUpdateRequest(), {
    uuid: randomUUID(),
  })

  const videoUpdateServiceStub = mockVideoUpdateServiceStub()
  const sut = new VideoUpdateController(videoUpdateServiceStub)

  return { sut, httpContext, videoUpdateServiceStub }
}

test.group('VideoUpdateController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('returns 400 if isDraft is not boolean', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request.body(), 'isDraft').value('any_value')
    await sut.update(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'isDraft',
        message: 'The value must be a boolean',
      },
    ])
  })

  test('returns 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request, 'body').returns({
      isDraft: false,
    })

    await sut.update(ctx)

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
      {
        field: 'lyrics',
        message: 'The lyrics field must be defined',
      },
    ])
  })

  test('returns 400 if releseYear not contains four length', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('00000')

    await sut.update(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field must be 4 characters long',
      },
    ])
  })

  test('returns 400 if releseYear is not string numeric', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('abcd')

    await sut.update(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field format is invalid',
      },
    ])
  })

  test('returns 400 if fields not contains most three characteres', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: 'ab',
      artist: 'ab',
    })

    await sut.update(ctx)

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
  })

  test('returns 400 if fields are empty', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: '',
      artist: '',
      releaseYear: '',
    })

    await sut.update(ctx)

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
  })

  test('returns 400 if linkYoutube is not link valid', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'linkYoutube').value('any_link')

    await sut.update(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'linkYoutube',
        message: 'The linkYoutube field format is invalid',
      },
    ])
  })

  test('returns 400 if invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.update(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('returns 404 if a video return not found', async ({ expect }) => {
    const { sut, httpContext, videoUpdateServiceStub } = await makeSut()
    stub(videoUpdateServiceStub, 'update').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.update(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('returns 200 if video updated on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    const httpResponse = await sut.update(ctx)
    expect(httpResponse).toBeTruthy()
  })

  test('returns 500 if video update throws', async ({ expect }) => {
    const { sut, httpContext: ctx, videoUpdateServiceStub } = await makeSut()

    stub(videoUpdateServiceStub, 'update').throws(new Error())

    const httpResponse = sut.update(ctx)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
