import { ok } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { IGenrerService } from '#services/interfaces/IGenrerService'

@inject()
export default class GenrerController {
  constructor(private readonly genrerService: IGenrerService) {}

  async findAll() {
    const genres = await this.genrerService.findAll()

    return ok(genres)
  }
}
