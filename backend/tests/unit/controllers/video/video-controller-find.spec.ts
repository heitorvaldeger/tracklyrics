import _ from 'lodash'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, notFound, ok } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'

test.group('VideoController.find', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if a video return on success', async ({ expect }) => {
    const { fakeVideo, language, genrer } = await makeFakeVideo()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const sut = new VideoController()
    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(
      ok({
        ..._.omit(fakeVideo, 'languageId', 'genrerId'),
        language: language.name,
        genrer: genrer.name,
      })
    )
  })

  test('should returns 404 if a video return not found', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const sut = new VideoController()
    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid on find', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const sut = new VideoController()
    const httpResponse = await sut.find(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })
})
