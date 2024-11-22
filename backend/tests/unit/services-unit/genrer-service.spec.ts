import { test } from '@japa/runner'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { GenrerFindModel } from '#models/genrer-model/genrer-find-model'
import { GenrerService } from '#services/genrer-service'

const mockFakeGenrerRepositoryStub = () => {
  class GenrerRepositoryStub implements IFindAllRepository {
    findAll(): Promise<GenrerFindModel[]> {
      return new Promise((resolve) => resolve([]))
    }
  }

  return new GenrerRepositoryStub()
}
const makeSut = () => {
  const fakeGenrerRepositoryStub = mockFakeGenrerRepositoryStub()
  const sut = new GenrerService(fakeGenrerRepositoryStub)

  return { sut }
}

test.group('GenrerService.findAll', () => {
  test('should returns a list of genres with on success', async ({ expect }) => {
    const { sut } = makeSut()

    const httpResponse = await sut.findAll()

    expect(httpResponse).toEqual([])
  })
})
