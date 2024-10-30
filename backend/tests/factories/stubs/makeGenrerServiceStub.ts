import { IGenrerResponse } from '#interfaces/IGenrerResponse'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import _ from 'lodash'

export const makeGenrerServiceStub = () => {
  const fakeGenrer: IGenrerResponse = {
    id: BigInt(0),
    name: 'any_name',
  }
  class GenrerServiceStub implements IGenrerService {
    async findAll(): Promise<IGenrerResponse[]> {
      return new Promise((resolve) => resolve([fakeGenrer]))
    }
  }

  return {
    genrerServiceStub: new GenrerServiceStub(),
    fakeGenrer,
  }
}
