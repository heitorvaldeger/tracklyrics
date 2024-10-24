import { inject } from '@adonisjs/core'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { IGenrerResponse } from '#interfaces/IGenrerResponse'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class GenrerService implements IGenrerService {
  constructor(private readonly findAllRepository: IFindAllRepository) {}

  async findAll(): Promise<IGenrerResponse[]> {
    return await this.findAllRepository.findAll()
  }
}
