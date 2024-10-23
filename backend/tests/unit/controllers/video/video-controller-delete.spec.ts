import { HttpContextFactory } from '@adonisjs/core/factories/http'
import sinon, { stub } from 'sinon'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { badRequest, noContent, notFound } from '#helpers/http'
import { makeFakeVideo } from '#tests/factories/makeFakeVideo'

test.group('VideoController.delete', (group) => {
  group.each.teardown(() => {
    sinon.reset()
    sinon.restore()
  })

  test('should returns 204 if video was delete on success', async ({ expect }) => {
    const { fakeVideo } = await makeFakeVideo()
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: fakeVideo.uuid,
    })

    const sut = new VideoController()
    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(noContent())
  })

  test('should returns 404 if a video return not found on delete', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: '00000000-0000-0000-0000-000000000000',
    })

    const sut = new VideoController()
    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toEqual(notFound())
  })

  test('should returns 400 if pass invalid uuid', async ({ expect }) => {
    const httpContext = new HttpContextFactory().create()
    stub(httpContext.request, 'params').returns({
      uuid: 'any_uuid',
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
