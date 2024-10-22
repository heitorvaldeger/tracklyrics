/* eslint-disable @unicorn/no-await-expression-member */
import _, { random } from 'lodash'
import sinon, { stub, spy } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { badRequest, noContent, serverError } from '#helpers/http'
import { makeHttpRequestBody } from '#tests/factories/makeHttpRequestBody'
import { makeFakeLanguage } from '#tests/factories/makeFakeLanguage'

const makeFakeRequest = () => ({
  isDraft: false,
  title: 'any_title',
  artist: 'any_artist',
  releaseYear: '0000',
  linkYoutube: 'any_link',
  languageId: 0,
})

test.group('VideoController.create', (group) => {
  let httpRequest = makeFakeRequest()
  group.setup(async () => {
    httpRequest.languageId = (await makeFakeLanguage()).id
  })
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 400 if isDraft is not a boolean', async ({ expect }) => {
    stub(httpRequest, 'isDraft').value('any_value')
    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(httpRequest))

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
    const sut = new VideoController()
    const httpResponse = await sut.create(
      makeHttpRequestBody({
        isDraft: false,
      })
    )

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
      ])
    )
  })

  test('should returns 400 if releseYear not contains four length', async ({ expect }) => {
    stub(httpRequest, 'releaseYear').value('any_year')

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(httpRequest))

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
    stub(httpRequest, 'releaseYear').value('year')

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(httpRequest))

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
    stub(httpRequest, 'title').value('an')
    stub(httpRequest, 'artist').value('an')
    stub(httpRequest, 'linkYoutube').value('an')

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(httpRequest))

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
    const sut = new VideoController()
    const httpResponse = await sut.create(
      makeHttpRequestBody({
        ...httpRequest,
        title: '',
        artist: '',
        releaseYear: '',
        linkYoutube: '',
      })
    )

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
    const httpResponse = await sut.create(makeHttpRequestBody(httpRequest))

    expect(httpResponse).toEqual(noContent())
  })

  test('should returns 500 if video create throws', async ({ expect }) => {
    stub(Video, 'create').throws(new Error())

    const sut = new VideoController()
    const httpResponse = await sut.create(makeHttpRequestBody(makeFakeRequest()))

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
