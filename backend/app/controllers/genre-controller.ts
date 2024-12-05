import { inject } from '@adonisjs/core'

import { ok } from '#helpers/http'
import { GenreProtocolService } from '#services/protocols/genre-protocol-service'

@inject()
export default class GenreController {
  constructor(private readonly genreService: GenreProtocolService) {}

  async findAll() {
    const genres = await this.genreService.findAll()

    return ok(genres)
  }
}
