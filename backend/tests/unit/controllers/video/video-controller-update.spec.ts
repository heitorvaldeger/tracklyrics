import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, noContent, notFound, serverError } from '#helpers/http'
import { makeHttpRequestBody } from '#tests/factories/makeHttpRequestBody'
import { makeFakeLanguage } from '#tests/factories/makeFakeLanguage'
import { IVideoCreateRequest } from '#interfaces/IVideoCreateRequest'
import { makeFakeGenrer } from '#tests/factories/makeFakeGenrer'
import { makeFakeVideoServiceStub } from '#tests/factories/makeFakeVideoServiceStub'
import { makeYoutubeUrl } from '#tests/factories/makeYoutubeUrl'
import { FakeVideoFactory, makeFakeVideo } from '#tests/factories/makeFakeVideo'
import { createFailureResponse } from '#helpers/method-response'
import { APPLICATION_ERRORS } from '#helpers/application-errors'

const makeFakeRequest = (): IVideoCreateRequest => ({
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  releaseYear: '0000',
  linkYoutube: makeYoutubeUrl(),
  languageId: 0,
  genrerId: 0,
})

const makeSut = async () => {
  const fakeLanguage = await makeFakeLanguage()
  const fakeGenrer = await makeFakeGenrer()

  const fakeRequest: IVideoCreateRequest = {
    ...makeFakeRequest(),
    languageId: fakeLanguage.id,
    genrerId: fakeGenrer.id,
  }
  const httpContext = makeHttpRequestBody(fakeRequest)

  const videoServiceStub = makeFakeVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, httpContext, videoServiceStub }
}

test.group('VideoController.update', (group) => {
  let fakeVideo: FakeVideoFactory
  group.setup(async () => {
    fakeVideo = await makeFakeVideo()
  })
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if isDraft is not a boolean', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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

  test('should returns 400 if releseYear not is string numeric', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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

  test('should returns 400 if fields is empty', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    const httpBody = httpContext.request.body()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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

  test('should returns 400 if linkYoutube is not Youtube link valid', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })
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

  test('should returns 400 if pass invalid uuid on update', async ({ expect }) => {
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

  test('should returns 404 if a video return not found on delete', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(videoServiceStub, 'update').returns(
      new Promise((resolve) => resolve(createFailureResponse(APPLICATION_ERRORS.VIDEO_NOT_FOUND)))
    )
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 200 if video was update on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const httpResponse = await sut.update(httpContext)
    expect(httpResponse).toEqual(noContent())
  })

  test('should returns 500 if video update throws', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = await makeSut()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    stub(videoServiceStub, 'update').throws(new Error())

    const httpResponse = await sut.update(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
