import { inject } from '@adonisjs/core'

import { IGenreRepository } from '#infra/db/repository/interfaces/genre-repository'
import { IGenreService } from '#services/interfaces/genre-service'

@inject()
export class GenreService implements IGenreService {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async findAll() {
    return await this.genreRepository.findAll()
  }
}
