import { randomUUID } from 'node:crypto'
import VideoController from '#controllers/VideoController'
import Video from '#models/video'
import { test } from '@japa/runner'
import { badRequest, ok } from '../../../app/helpers/http.js'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

test.group('VideoController', (group) => {
  group.teardown(async () => {
    await Video.query().whereNotNull('id').delete()
  })
  test('should returns 200 if a list videos returns on success', async ({ assert }) => {
    const uuid = randomUUID()
    const fakeVideo = {
      isDraft: false,
      title: 'any_title',
      artist: 'any_artist',
      qtyViews: BigInt(0),
      releaseYear: '2000',
      linkYoutube: 'any_link',
      uuid: uuid,
    }
    await Video.create(fakeVideo)
    const sut = new VideoController()
    const videos = await sut.findAll()

    assert.deepEqual(videos, ok([fakeVideo]))
  })

  test('should returns 400 if isDraft is not a boolean', async ({ assert }) => {
    const fakeVideo = {
      isDraft: 'any_value',
      title: 'any_title',
      artist: 'any_artist',
      releaseYear: '2000',
      linkYoutube: 'any_link',
    }

    const httpContext = new HttpContextFactory().create()
    httpContext.request.updateBody(fakeVideo)
    const sut = new VideoController()
    const httpResponse = await sut.create(httpContext)

    assert.deepEqual(
      httpResponse,
      badRequest([
        {
          field: 'isDraft',
          message: 'The value must be a boolean',
          rule: 'boolean',
        },
      ])
    )
  })

  test('should returns 400 if required fields is not provided', async ({ assert }) => {
    const fakeVideo = {
      isDraft: false,
    }

    const httpContext = new HttpContextFactory().create()
    httpContext.request.updateBody(fakeVideo)
    const sut = new VideoController()
    const httpResponse = await sut.create(httpContext)

    assert.deepEqual(
      httpResponse,
      badRequest([
        {
          field: 'title',
          message: 'The title field must be defined',
          rule: 'required',
        },
        {
          field: 'artist',
          message: 'The artist field must be defined',
          rule: 'required',
        },
        {
          field: 'releaseYear',
          message: 'The releaseYear field must be defined',
          rule: 'required',
        },
        {
          field: 'linkYoutube',
          message: 'The linkYoutube field must be defined',
          rule: 'required',
        },
      ])
    )
  })
})
