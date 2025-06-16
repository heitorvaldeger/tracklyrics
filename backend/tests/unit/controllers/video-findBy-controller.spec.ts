import { test } from '@japa/runner'
import _ from 'lodash'
import { spy, stub } from 'sinon'

import VideoFindController from '#controllers/video-find-controller'
import { mockVideoData, mockVideoFindService } from '#tests/__mocks__/stubs/mock-video-stub'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'
import { NilUUID } from '#tests/__utils__/NilUUID'

const makeSut = () => {
  const httpContext = makeHttpRequest()
  const sut = new VideoFindController(mockVideoFindService)
  return { sut, httpContext }
}

test.group('VideoFindController.findBy()', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('return 200 if return a list videos on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual([mockVideoData])
  })

  test('calls VideoFindService findBy with correct values', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const findBySpy = spy(mockVideoFindService, 'findBy')
    stub(httpContext.request, 'qs').returns({
      genreId: 0,
      languageId: 0,
      userUuid: NilUUID,
    })

    await sut.findBy(httpContext)
    expect(
      findBySpy.calledWith({
        genreId: 0,
        languageId: 0,
        userUuid: NilUUID,
      })
    ).toBeTruthy()
  })

  test('return 400 if invalid params is provided', async ({ expect }) => {
    const { sut, httpContext: ctx } = makeSut()
    stub(ctx.request, 'qs').returns({
      genreId: 'any_id',
      languageId: 'any_id',
      userUuid: 'any_uuid',
    })

    await sut.findBy(ctx)
    expect(ctx.response.getBody()).toEqual([
      {
        field: 'genreId',
        message: 'The genreId field must be a number',
      },
      {
        field: 'languageId',
        message: 'The languageId field must be a number',
      },
      {
        field: 'userUuid',
        message: 'The userUuid field must be a valid UUID',
      },
    ])
  })

  test('return 500 if video findBy return throws', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(mockVideoFindService, 'findBy').throws(new Error())
    const httpResponse = sut.findBy(httpContext)
    expect(httpResponse).rejects.toEqual(new Error())
  })
})
