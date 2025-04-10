import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import GameController from '#controllers/game-controller'
import { GameModesHash } from '#enums/game-modes-hash'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockGameData, mockGameServiceStub } from '#tests/__mocks__/stubs/mock-game-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = async () => {
  const httpContext = makeHttpRequest(
    {},
    {
      uuid: randomUUID(),
      mode: GameModesHash.BEGINNER,
    }
  )

  const gameServiceStub = mockGameServiceStub()
  const sut = new GameController(gameServiceStub)

  return { sut, httpContext, gameServiceStub }
}

test.group('GameController.getGame()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if fields provided are invalid', async ({ expect }) => {
    const { sut, httpContext: ctx } = await makeSut()

    stub(ctx.request, 'params').returns({
      uuid: 'invalid_uuid',
      mode: 'any_mode',
    })

    await sut.getGame(ctx)

    expect(ctx.response.getBody()).toEqual([
      {
        field: 'uuid',
        message: 'The uuid field must be a valid UUID',
      },
      {
        field: 'mode',
        message: 'The selected mode is invalid',
      },
    ])
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()
    stub(gameServiceStub, 'getGame').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
      mode: GameModesHash.BEGINNER,
    })

    const httpResponse = sut.getGame(httpContext)

    expect(httpResponse).rejects.toEqual(new VideoNotFoundException())
  })

  test('return 200 with game info on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.getGame(httpContext)
    expect(httpResponse).toEqual(mockGameData)
  })
})
