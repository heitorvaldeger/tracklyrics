import { inject } from '@adonisjs/core'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'
import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { GenreRepository } from '#repository/protocols/base-repository'

@inject()
export class GenreService implements GenreProtocolService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<GenreFindModel[]> {
    return await this.genreRepository.findAll()
  }
}
