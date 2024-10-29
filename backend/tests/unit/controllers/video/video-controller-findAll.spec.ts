import _ from 'lodash'
import { test } from '@japa/runner'
import VideoController from '#controllers/VideoController'
import { stub } from 'sinon'
import { ok, serverError } from '#helpers/http'
import { makeVideoServiceStub } from '#tests/factories/stubs/makeVideoServiceStub'

const makeSut = () => {
  const videoServiceStub = makeVideoServiceStub()
  const sut = new VideoController(videoServiceStub)

  return { sut, videoServiceStub }
}

test.group('VideoController.findAll', () => {
  test('should returns 200 if a list videos returns on success', async ({ expect }) => {
    const { sut } = makeSut()
    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([]))
  })

  test('should returns 500 if video find throws', async ({ expect }) => {
    const { sut, videoServiceStub } = makeSut()
    stub(videoServiceStub, 'findAll').throws(new Error())

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
