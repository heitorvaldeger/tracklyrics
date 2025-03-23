import { inject } from '@adonisjs/core'

import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

@inject()
export default class GenreController {
  constructor(private readonly genreService: GenreProtocolService) {}

  async findAll() {
    return await this.genreService.findAll()
  }
}
