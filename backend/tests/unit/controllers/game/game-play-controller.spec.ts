import { randomUUID } from 'node:crypto'

import { test } from '@japa/runner'
import { stub } from 'sinon'

import { APPLICATION_MESSAGES } from '#constants/app-messages'
import GameController from '#controllers/game-controller'
import { badRequest, notContent, notFound, serverError } from '#helpers/http'
import { createFailureResponse } from '#helpers/method-response'
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
    const { sut, httpContext } = await makeSut()

    stub(httpContext.request, 'params').returns({
      uuid: 'invalid_uuid',
    })

    const httpResponse = await sut.play(httpContext)

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
    stub(gameServiceStub, 'play').resolves(
      createFailureResponse(APPLICATION_MESSAGES.VIDEO_NOT_FOUND)
    )
    stub(httpContext.request, 'params').returns({
      uuid: NilUUID,
    })

    const httpResponse = await sut.play(httpContext)

    expect(httpResponse).toEqual(notFound(APPLICATION_MESSAGES.VIDEO_NOT_FOUND))
  })

  test('return 200 if video was play on success', async ({ expect }) => {
    const { sut, httpContext } = await makeSut()

    const httpResponse = await sut.play(httpContext)
    expect(httpResponse).toEqual(notContent())
  })

  test('return 500 if video play throws', async ({ expect }) => {
    const { sut, httpContext, gameServiceStub } = await makeSut()

    stub(gameServiceStub, 'play').throws(new Error())

    const httpResponse = await sut.play(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
