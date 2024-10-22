import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { notFound, ok } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'

test.group('VideoController.find', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 200 if a video return on success', async ({ expect }) => {
    const fakeVideo = await makeFakeVideo()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const sut = new VideoController()
    const video = await sut.find(httpContext)

    expect(video).toEqual(ok(fakeVideo))
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
})
