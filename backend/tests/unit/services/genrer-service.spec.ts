import { test } from '@japa/runner'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'
import { IGenrerResponse } from '#interfaces/IGenrerResponse'
import { GenrerService } from '#services/GenrerService'

const makeFakeGenrerRepositoryStub = () => {
  class GenrerRepositoryStub implements IFindAllRepository {
    findAll(): Promise<IGenrerResponse[]> {
      return new Promise((resolve) => resolve([]))
    }
  }

  return new GenrerRepositoryStub()
}
const makeSut = () => {
  const fakeGenrerRepositoryStub = makeFakeGenrerRepositoryStub()
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
