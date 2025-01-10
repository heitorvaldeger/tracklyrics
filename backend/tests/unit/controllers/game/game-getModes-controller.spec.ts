import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import GameController from '#controllers/game-controller'
import { APPLICATION_MESSAGES } from '#helpers/application-messages'
import { badRequest, notFound, ok, serverError } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
import { makeGameModesStub } from '#tests/factories/makeGameModesResponse'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { mockGameServiceStub } from '#tests/factories/stubs/services/mock-game-service-stub'
import { NilUUID } from '#tests/utils/NilUUID'

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

test.group('GameController.getModes()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 400 if invalid video uuid is provided', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.getModes(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'uuid',
          message: 'The uuid field must be a valid UUID',
        },
      ])
    )
  })

  test('returns 404 if a video not found', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()
    stub(gameServiceStub, 'getModes').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.getModes(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return 200 with modes on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.getModes(httpContext)
    expect(httpResponse).toEqual(ok(makeGameModesStub().stub))
  })

  test('return 500 if get modes throws', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()

    stub(gameServiceStub, 'getModes').throws(new Error())

    const httpResponse = await sut.getModes(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
