import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import GameController from '#controllers/game-controller'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockGameServiceStub } from '#tests/__mocks__/stubs/mock-game-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: randomUUID(),
    }
  )

  const gameServiceStub = mockGameServiceStub()
  const sut = new GameController(gameServiceStub)

  return { sut, httpContext, gameServiceStub }
}

test.group('GameController.play()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    await sut.play(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
    ])
  })

  test('returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()
    stub(gameServiceStub, 'play').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = sut.play(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 if video was play on success', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    await sut.play(ctx)
    expect(ctx.response.getStatus()).toBe(204)
  })

  test('return 500 if video play throws', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()

    stub(gameServiceStub, 'play').throws(new Error())

    const httpResponse = sut.play(httpContext)

    expect(httpResponse).rejects.toEqual(new Error())
  })
})
