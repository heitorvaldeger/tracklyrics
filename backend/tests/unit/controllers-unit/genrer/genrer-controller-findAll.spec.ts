import GenrerController from '#controllers/genrer-controller'
import { test } from '@japa/runner'
import { ok } from '#helpers/http'
import { GenrerFindModel } from '#models/genrer-model/genrer-find-model'
import { IGenrerService } from '#services/interfaces/IGenrerService'

const mockFakeGenrer = (): GenrerFindModel[] => [
  {
    id: 0,
    name: 'any_name',
  },
]

export const makeGenrerServiceStub = () => {
  class GenrerServiceStub implements IGenrerService {
    async findAll(): Promise<GenrerFindModel[]> {
      return new Promise((resolve) => resolve(mockFakeGenrer()))
    }
  }

  return new GenrerServiceStub()
}

const makeSut = () => {
  const genrerServiceStub = makeGenrerServiceStub()
  const sut = new GenrerController(genrerServiceStub)

  return { sut }
}

test.group('GenrerController.findAll()', () => {
  test('should returns a list of genres on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual(ok(mockFakeGenrer()))
  })
})
