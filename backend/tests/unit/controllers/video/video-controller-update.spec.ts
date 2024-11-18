import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/video-controller'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { makeVideoServiceStub } from '#tests/factories/stubs/makeVideoServiceStub'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'
import { randomUUID } from 'node:crypto'
import { NilUUID } from '#tests/utils/NilUUID'
import { makeFakeRequest } from './factories/make-fake-request.js'

const makeSut = async () => {
  const httpContext = makeHttpRequest(makeFakeRequest(), {
    uuid: randomUUID(),
  })

  const videoServiceStub = makeVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoController.update()', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if isDraft is not boolean', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request.body(), 'isDraft').value('any_value')
    const httpResponse = await sut.update(httpContext)

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
    const httpResponse = await sut.update(httpContext)

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
          field: 'genrerId',
          message: 'The genrerId field must be defined',
        },
      ])
    )
  })

  test('should returns 400 if releseYear not contains four length', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'releaseYear').value('00000')

    const httpResponse = await sut.update(httpContext)

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

    const httpResponse = await sut.update(httpContext)

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

    const httpResponse = await sut.update(httpContext)

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

  test('should returns 400 if fields are empty', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    const httpBody = httpContext.request.body()
    stub(httpContext.request, 'body').returns({
      ...httpBody,
      title: '',
      artist: '',
      releaseYear: '',
    })

    const httpResponse = await sut.update(httpContext)

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

  test('should returns 400 if linkYoutube is not link valid', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request.body(), 'linkYoutube').value('any_link')

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'linkYoutube',
          message: 'The linkYoutube field format is invalid',
        },
      ])
    )
  })

  test('should returns 400 if invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('should returns 404 if a video return not found', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'update').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_ERRORS.VIDEO_NOT_FOUND.message))
  })

  test('should returns 200 if video updated on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.update(httpContext)
    expect(httpResponse).toEqual(ok(true))
  })

  test('should returns 500 if video update throws', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()

    stub(videoServiceStub, 'update').throws(new Error())

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
