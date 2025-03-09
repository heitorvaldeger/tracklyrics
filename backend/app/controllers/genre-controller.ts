import { inject } from '@adonisjs/core'

import { dispatch } from '#helpers/dispatch'
import { ok } from '#helpers/http'
import { GenreProtocolService } from '#services/_protocols/genre-protocol-service'

@inject()
export default class GenreController {
  constructor(private readonly genreService: GenreProtocolService) {}

  async findAll() {
    try {
      const genres = await this.genreService.findAll()

      return dispatch(genres)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
