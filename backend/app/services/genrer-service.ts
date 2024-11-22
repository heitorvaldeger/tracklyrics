import { inject } from '@adonisjs/core'
import { IGenrerService } from '#services/interfaces/IGenrerService'
import { GenrerFindModel } from '#models/genrer-model/genrer-find-model'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class GenrerService implements IGenrerService {
  constructor(private readonly findAllRepository: IFindAllRepository) {}

  async findAll(): Promise<GenrerFindModel[]> {
    return await this.findAllRepository.findAll()
  }
}
