import { IGenrerResponse } from '#interfaces/IGenrerResponse'

export abstract class IFindAllGenrerRepository {
  abstract findAll(): Promise<IGenrerResponse[]>
}
