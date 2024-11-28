import _ from 'lodash'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import { badRequest, noContent, ok, serverError, unprocessable } from '#helpers/http'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { createFailureResponse, createSuccessResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { mockVideoRequest } from '../../../factories/fakes/mock-video-request.js'
import VideoCreateController from '#controllers/video/video-create-controller'
import { VideoCreateProtocolService } from '#services/video/protocols/video-create-protocol-service'

const videoRequest = mockVideoRequest()
export const mockVideoCreateServiceStub = (): VideoCreateProtocolService => ({
  create: (payload: VideoCreateProtocolService.Params) =>
    Promise.resolve(createSuccessResponse(videoRequest)),
})

const makeSut = async () => {
  const httpContext = makeHttpRequest(mockVideoRequest())

  const videoCreateServiceStub = mockVideoCreateServiceStub()
  const sut = new VideoCreateController(videoCreateServiceStub)

  return { sut, httpContext, videoCreateServiceStub }
}

test.group('VideoCreateController', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if isDraft is not a boolean', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'isDraft').value('any_value')

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'isDraft',
          message: 'The value must be a boolean',
        },
      ])
    )
  })

  test('should returns 400 if required fields is not provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request, 'body').returns({
      isDraft: false,
    })
    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
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
    )
  })

  test('should returns 400 if releseYear not contains four length', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'releaseYear').value('00000')

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'releaseYear',
          message: 'The releaseYear field must be 4 characters long',
        },
      ])
    )
  })

  test('should returns 400 if releseYear is not string numeric', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'releaseYear').value('abcd')

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'releaseYear',
          message: 'The releaseYear field format is invalid',
        },
      ])
    )
  })

  test('should returns 400 if fields not contains most three characteres', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    const httpBody = httpContext.request.body()
    stub(httpContext.request, 'body').returns({
      ...httpBody,
      title: 'ab',
      artist: 'ab',
    })

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'title',
          message: 'The title field must have at least 3 characters',
        },
        {
          field: 'artist',
          message: 'The artist field must have at least 3 characters',
        },
      ])
    )
  })

  test('should returns 400 if string fields is empty', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    const httpBody = httpContext.request.body()
    stub(httpContext.request, 'body').returns({
      ...httpBody,
      title: '',
      artist: '',
      releaseYear: '',
    })

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
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
    )
  })

  test('should returns 400 if linkYoutube is not valid link', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'linkYoutube').value('any_link')

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'linkYoutube',
          message: 'The linkYoutube field format is invalid',
        },
      ])
    )
  })

  test('should returns 200 if video created on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(ok(videoRequest))
  })

  test('should returns 500 if video create throws', async ({ expect }) => {
    const { sut, httpContext, videoCreateServiceStub } = await makeSut()

    stub(videoCreateServiceStub, 'create').throws(new Error())

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should returns 422 if link youtube already exists', async ({ expect }) => {
    const { sut, httpContext, videoCreateServiceStub } = await makeSut()
    stub(videoCreateServiceStub, 'create').resolves(
      createFailureResponse(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS)
    )

    const httpResponse = await sut.create(httpContext)

    expect(httpResponse).toEqual(unprocessable(APPLICATION_ERRORS.YOUTUBE_LINK_ALREADY_EXISTS))
  })
})
