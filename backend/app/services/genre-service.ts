import { inject } from '@adonisjs/core'

import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { Genre } from '#models/genre'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

@inject()
export class GenreService implements GenreProtocolService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll() {
    return await this.genreRepository.findAll()
  }
}
