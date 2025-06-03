import { inject } from '@adonisjs/core'

import { IGenreService } from '#services/interfaces/genre-service'

@inject()
export default class FindAllGenreController {
  constructor(private readonly genreService: IGenreService) {}

  async handle() {
    return await this.genreService.findAll()
  }
}
