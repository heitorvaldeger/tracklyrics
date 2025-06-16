import { inject } from '@adonisjs/core'

import { IGenreService } from '#services/interfaces/genre-service'

@inject()
export default class GenreController {
  constructor(private readonly genreService: IGenreService) {}

  async findAll() {
    return await this.genreService.findAll()
  }
}
