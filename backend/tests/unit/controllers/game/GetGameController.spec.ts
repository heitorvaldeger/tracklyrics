import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import GetGameController from '#controllers/game/GetGameController'
import { GameModesHash } from '#enums/game-modes-hash'
import ValidationException from '#exceptions/ValidationException'
import VideoNotFoundException from '#exceptions/video-not-found-exception'
import { mockGameServiceStub } from '#tests/__mocks__/stubs/mock-game-stub'
import { validatorSchema } from '#tests/__mocks__/validators/validator-schema'
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
  const sut = new GetGameController(gameServiceStub, validatorSchema)

  return { sut, httpContext, gameServiceStub }
}

test.group('Game/GetGameController', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return an exception if Validation throws', async ({ expect }) => {
    const { sut, httpContext: context } = await makeSut()
    stub(validatorSchema, 'validateAsync').rejects(new ValidationException([]))

    const promise = sut.handle(context)
    await expect(promise).rejects.toThrow(new ValidationException([]))
  })

  test('return 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()
    stub(gameServiceStub, 'getGame').rejects(new VideoNotFoundException())
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
      mode: GameModesHash.BEGINNER,
    })

    const httpResponse = sut.handle(httpContext)

    await expect(httpResponse).rejects.toThrow(new VideoNotFoundException())
  })

  test('return 200 with game info on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.handle(httpContext)

    expect(httpResponse).toEqual({
      gaps: 0,
      lyrics: [],
    })
  })
})
