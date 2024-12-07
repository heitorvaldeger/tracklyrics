import { test } from '@japa/runner'
import _ from 'lodash'
import { spy, stub } from 'sinon'

import VideoFindController from '#controllers/video/video-find-controller'
import { badRequest, ok, serverError } from '#helpers/http'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { mockVideoModel } from '#tests/factories/mocks/mock-video-model'
import { mockVideoFindServiceStub } from '#tests/factories/stubs/services/mock-video-find-service-stub'
import { NilUUID } from '#tests/utils/NilUUID'

const makeSut = () => {
  const videoServiceStub = mockVideoFindServiceStub()
  const httpContext = makeHttpRequest()
  const sut = new VideoFindController(videoServiceStub)
  return { sut, videoServiceStub, httpContext }
}

test.group('VideoFindController.findBy()', () => {
  test('should returns 200 if return a list videos on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual(ok([mockVideoModel()]))
  })

  test('should calls VideoFindService findBy with correct values', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = makeSut()
    const findBySpy = spy(videoServiceStub, 'findBy')
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

  test('should returns 400 if invalid params is provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'qs').returns({
      genreId: 'any_id',
      languageId: 'any_id',
      userUuid: 'any_uuid',
    })

    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual(
      badRequest([
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
    )
  })

  test('should returns 500 if video findBy return throws', async ({ expect }) => {
    const { sut, videoServiceStub, httpContext } = makeSut()
    stub(videoServiceStub, 'findBy').throws(new Error())
    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
