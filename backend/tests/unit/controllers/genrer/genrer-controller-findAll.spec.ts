import GenrerController from '#controllers/GenrerController'
import Genrer from '#models/genrer'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import Video from '#models/video'
import { makeFakeGenrerServiceStub } from '#tests/factories/makeFakeGenrerServiceStub'

const makeSut = () => {
  const { genrerServiceStub, fakeGenrer } = makeFakeGenrerServiceStub()
  const sut = new GenrerController(genrerServiceStub)

  return { sut, fakeGenrer }
}
test.group('GenrerController.findAll', (group) => {
  group.teardown(async () => {
    await Video.query().whereNotNull('id').delete()
    await Genrer.query().whereNotNull('id').delete()
  })

  test('should returns a list of genres with on success', async ({ expect }) => {
    const { sut, fakeGenrer } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([fakeGenrer]))
  })
})
