import { inject } from '@adonisjs/core'

import { createSuccessResponse } from '#helpers/method-response'
import { MethodResponse } from '#helpers/types/method-response'
import { GenreRepository } from '#infra/db/repository/_protocols/genre-repository'
import { Genre } from '#models/genre'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

@inject()
export class GenreService implements GenreProtocolService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<MethodResponse<Genre[]>> {
    const genres = await this.genreRepository.findAll()
    return createSuccessResponse(genres)
  }
}
