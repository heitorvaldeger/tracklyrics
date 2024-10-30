import { IGenrerResponse } from '#interfaces/IGenrerResponse'

export abstract class IGenrerService {
  abstract findAll(): Promise<IGenrerResponse[]>
}
