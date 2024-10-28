import GenrerController from '#controllers/GenrerController'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { makeFakeGenrerServiceStub } from '#tests/factories/makeFakeGenrerServiceStub'

const makeSut = () => {
  const { genrerServiceStub, fakeGenrer } = makeFakeGenrerServiceStub()
  const sut = new GenrerController(genrerServiceStub)

  return { sut, fakeGenrer }
}
test.group('GenrerController.findAll', () => {
  test('should returns a list of genres with on success', async ({ expect }) => {
    const { sut, fakeGenrer } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok([fakeGenrer]))
  })
})
