import { test } from '@japa/runner'
import sinon, { stub } from 'sinon'

import VideoCreateController from '#controllers/video-create-controller'
import YoutubeLinkAlreadyExistsException from '#exceptions/youtube-link-already-exists-exception'
import { VideoCreateProtocolService } from '#services/_protocols/video-create-protocol-service'
import {
  mockVideoCreateOrUpdateRequest,
  mockVideoCreateOrUpdateResponse,
} from '#tests/__mocks__/mock-video-request'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

export const mockVideoCreateServiceStub = (): VideoCreateProtocolService => ({
  create: (payload: VideoCreateProtocolService.Params) =>
    Promise.resolve(mockVideoCreateOrUpdateResponse),
})

const makeSut = async () => {
  const httpContext = makeHttpRequest(mockVideoCreateOrUpdateRequest)

  const videoCreateServiceStub = mockVideoCreateServiceStub()
  const sut = new VideoCreateController(videoCreateServiceStub)

  return { sut, httpContext, videoCreateServiceStub }
}

test.group('VideoCreateController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if isDraft is not a boolean', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'isDraft').value('any_value')

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'isDraft',
        message: 'The value must be a boolean',
      },
    ])
  })

  test('return 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request, 'body').returns({
      isDraft: false,
    })
    await sut.create(ctx)

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
  })

  test('return 400 if releseYear not contains four length', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('00000')

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field must be 4 characters long',
      },
    ])
  })

  test('return 400 if releseYear is not string numeric', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'releaseYear').value('abcd')

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'releaseYear',
        message: 'The releaseYear field format is invalid',
      },
    ])
  })

  test('return 400 if fields in lyrics are invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'lyrics').value([
      {
        startTime: 'invalid_time',
        endTime: 'invalid_time',
        line: '',
      },
    ])

    await sut.create(ctx)

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

  test('return 400 if lyrics is not array', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'lyrics').value({})

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'lyrics',
        message: 'The lyrics field must be an array',
      },
    ])
  })

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

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'startTime',
        message: 'The startTime field must be less than the endTime field',
      },
    ])
  })

  test('return 400 if fields not contains most three characteres', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: 'ab',
      artist: 'ab',
    })

    await sut.create(ctx)

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

  test('return 400 if string fields is empty', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpBody = ctx.request.body()
    stub(ctx.request, 'body').returns({
      ...httpBody,
      title: '',
      artist: '',
      releaseYear: '',
    })

    await sut.create(ctx)

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

  test('return 400 if linkYoutube is not valid link', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    stub(ctx.request.body(), 'linkYoutube').value('any_link')

    await sut.create(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'linkYoutube',
        message: 'The linkYoutube field format is invalid',
      },
    ])
  })

  test('return 200 if video created on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()
    const httpResponse = await sut.create(ctx)

    expect(httpResponse).toEqual(mockVideoCreateOrUpdateResponse)
  })

  test('return 500 if video create throws', async ({ expect }) => {
    const { sut, httpContext: ctx, videoCreateServiceStub } = await makeSut()

    stub(videoCreateServiceStub, 'create').throws(new Error())

    const httpResponse = sut.create(ctx)

    expect(httpResponse).rejects.toEqual(new Error())
  })

  test('return 422 if link youtube already exists', async ({ expect }) => {
    const { sut, httpContext, videoCreateServiceStub } = await makeSut()
    stub(videoCreateServiceStub, 'create').rejects(new YoutubeLinkAlreadyExistsException())

    const httpResponse = sut.create(httpContext)

    expect(httpResponse).rejects.toEqual(new YoutubeLinkAlreadyExistsException())
  })
})
