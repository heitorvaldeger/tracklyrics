import { inject } from '@adonisjs/core'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { IGenrerResponse } from '#interfaces/IGenrerResponse'
import { IFindAllGenrerRepository } from '#repository/interfaces/IFindAllGenrerRepository'

@inject()
export class GenrerService implements IGenrerService {
  constructor(private readonly findAllGenrerRepository: IFindAllGenrerRepository) {}

  async findAll(): Promise<IGenrerResponse[]> {
    return await this.findAllGenrerRepository.findAll()
  }
}
