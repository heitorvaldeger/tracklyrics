import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { stub } from 'sinon'
import { badRequest, ok, serverError } from '#helpers/http'
import { makeVideoServiceStub } from '#tests/factories/stubs/makeVideoServiceStub'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

const makeSut = () => {
  const videoServiceStub = makeVideoServiceStub()
  const httpContext = new HttpContextFactory().create()
  const sut = new VideoController(videoServiceStub)

  return { sut, videoServiceStub, httpContext }
}

test.group('VideoController.findByGenrer', () => {
  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })
    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(ok([]))
  })

  test('should returns 400 if pass invalid genrerId on findByGenrer', async ({ expect }) => {
    const { sut, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      genrerId: 'any_genrerId',
    })

    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(
      badRequest([
        {
          field: 'genrerId',
          message: 'The genrerId field must be a number',
        },
      ])
    )
  })

  test('should returns 500 if video find throws', async ({ expect }) => {
    const { sut, videoServiceStub, httpContext } = makeSut()
    stub(httpContext.request, 'params').returns({
      genrerId: 0,
    })

    stub(videoServiceStub, 'findByGenrer').throws(new Error())

    const httpResponse = await sut.findByGenrer(httpContext)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
