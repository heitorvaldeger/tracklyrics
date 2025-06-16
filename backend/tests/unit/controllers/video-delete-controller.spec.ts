import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { stub } from 'sinon'

import VideoDeleteController from '#controllers/video-delete-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { IVideoDeleteService } from '#services/interfaces/video-delete-service'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

export const mockVideoDeleteServiceStub = (): IVideoDeleteService => ({
  delete: (uuid: string) => Promise.resolve(true),
})

const makeSut = () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: faker.string.uuid(),
    }
  )
  const videoDeleteServiceStub = mockVideoDeleteServiceStub()
  const sut = new VideoDeleteController(videoDeleteServiceStub)

  return { sut, httpContext, videoDeleteServiceStub }
}

test.group('VideoDeleteController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })
  test('return 200 if video was delete on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()

    const httpResponse = await sut.delete(httpContext)

    expect(httpResponse).toBeTruthy()
  })

  test('return 404 if a video not found', ({ expect }) => {
    const { sut, httpContext, videoDeleteServiceStub } = makeSut()
    stub(videoDeleteServiceStub, 'delete').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.delete(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 400 if a invalid uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()
    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.delete(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('return 500 if video delete throws', ({ expect }) => {
    const { sut, httpContext, videoDeleteServiceStub } = makeSut()

    stub(videoDeleteServiceStub, 'delete').throws(new Error())

    const httpResponse = sut.delete(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
