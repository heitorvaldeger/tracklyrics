import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { badRequest, noContent, serverError } from '#helpers/http'
import { makeHttpRequestBody } from '#tests/factories/makeHttpRequestBody'

const makeFakeRequest = () => ({
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  releaseYear: '0000',
  linkYoutube: 'any_link',
})

test.group('VideoController.create', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if isDraft is not a boolean', async ({ expect }) => {
    const fakeVideo = {
      isDraft: 'any_value',
      title: 'any_title',
      artist: 'any_artist',
      releaseYear: '2000',
      linkYoutube: 'any_link',
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

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
    const fakeVideo = {
      isDraft: false,
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

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
      ])
    )
  })

  test('should returns 400 if releseYear not contains four length', async ({ expect }) => {
    const fakeVideo = {
      isDraft: false,
      title: 'any_title',
      artist: 'any_artist',
      releaseYear: 'any_year',
      linkYoutube: 'any_link',
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'releaseYear',
          message: 'The releaseYear field must be 4 characters long',
        },
      ])
    )
  })

  test('should returns 400 if releseYear not is numeric', async ({ expect }) => {
    const fakeVideo = {
      isDraft: false,
      title: 'any_title',
      artist: 'any_artist',
      releaseYear: 'year',
      linkYoutube: 'any_link',
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

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
    const fakeVideo = {
      isDraft: false,
      title: 'an',
      artist: 'an',
      releaseYear: '2004',
      linkYoutube: 'an',
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

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
          field: 'linkYoutube',
          message: 'The linkYoutube field must have at least 3 characters',
        },
      ])
    )
  })

  test('should returns 400 if fields is empty', async ({ expect }) => {
    const fakeVideo = {
      isDraft: false,
      title: '',
      artist: '',
      releaseYear: '',
      linkYoutube: '',
    }

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(fakeVideo))

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
        {
          field: 'linkYoutube',
          message: 'The linkYoutube field must have at least 3 characters',
        },
      ])
    )
  })

  test('should returns 200 if video was create on success', async ({ expect }) => {
    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(makeFakeRequest()))

    expect(httpResponse).toEqual(noContent())
  })

  test('should returns 500 if video create throws', async ({ expect }) => {
    stub(Video, 'create').throws(new Error())

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(makeFakeRequest()))

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
