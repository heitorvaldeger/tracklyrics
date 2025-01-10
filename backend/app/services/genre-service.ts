import { inject } from '@adonisjs/core'

import { GenreFindModel } from '#models/genre-model/genre-find-model'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'

import { GenreRepository } from '../infra/db/repository/protocols/genre-repository.js'

@inject()
export class GenreService implements GenreProtocolService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<GenreFindModel[]> {
    return await this.genreRepository.findAll()
  }
}
