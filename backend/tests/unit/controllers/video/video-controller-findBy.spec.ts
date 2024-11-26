import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/video-controller'
import { stub, spy } from 'sinon'
import { badRequest, ok, serverError } from '#helpers/http'
import { mockVideoServiceStub } from '#tests/factories/stubs/mock-video-service-stub'
import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
import { NilUUID } from '#tests/utils/NilUUID'
import { mockFakeVideoModel } from '#tests/factories/fakes/index'

const makeSut = () => {
  const videoServiceStub = mockVideoServiceStub()
  const httpContext = makeHttpRequest()
  const sut = new VideoController(videoServiceStub)
  return { sut, videoServiceStub, httpContext }
}

test.group('VideoController.findBy()', () => {
  test('should returns 200 if return a list videos on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual(ok([mockFakeVideoModel()]))
  })

  test('should calls VideoService findBy with correct values', async ({ expect }) => {
    const { sut, httpContext, videoServiceStub } = makeSut()
    const findBySpy = spy(videoServiceStub, 'findBy')
    stub(httpContext.request, 'qs').returns({
      genrerId: 0,
      languageId: 0,
      userUuid: NilUUID,
      videoUuid: NilUUID,
    })

    await sut.findBy(httpContext)
    expect(
      findBySpy.calledWith({
        genrerId: 0,
        languageId: 0,
        userUuid: NilUUID,
        videoUuid: NilUUID,
      })
    ).toBeTruthy()
  })

  test('should returns 400 if invalid params is provided', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'qs').returns({
      genrerId: 'any_id',
      languageId: 'any_id',
      userUuid: 'any_uuid',
      videoUuid: 'any_uuid',
    })

    const httpResponse = await sut.findBy(httpContext)
    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'genrerId',
          message: 'The genrerId field must be a number',
        },
        {
          field: 'languageId',
          message: 'The languageId field must be a number',
        },
        {
          field: 'userUuid',
          message: 'The userUuid field must be a valid UUID',
        },
        {
          field: 'videoUuid',
          message: 'The videoUuid field must be a valid UUID',
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
