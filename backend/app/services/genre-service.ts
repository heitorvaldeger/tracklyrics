import { inject } from '@adonisjs/core'

import { GenreRepository } from '#infra/db/repository/protocols/genre-repository'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'

@inject()
export class GenreService implements GenreProtocolService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<GenreFindModel[]> {
    return await this.genreRepository.findAll()
  }
}
