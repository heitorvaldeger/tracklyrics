import { ok } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { IGenreService } from '#services/interfaces/IGenreService'

@inject()
export default class GenreController {
  constructor(private readonly genreService: IGenreService) {}

  async findAll() {
    const genres = await this.genreService.findAll()

    return ok(genres)
  }
}
