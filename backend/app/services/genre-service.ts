import { inject } from '@adonisjs/core'
import { IGenreService } from '#services/interfaces/IGenreService'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { IFindAllRepository } from '#repository/interfaces/IFindAllRepository'

@inject()
export class GenreService implements IGenreService {
  constructor(private readonly findAllRepository: IFindAllRepository<GenreFindModel>) {}

  async findAll(): Promise<GenreFindModel[]> {
    return await this.findAllRepository.findAll()
  }
}
