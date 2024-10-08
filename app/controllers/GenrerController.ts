// import type { HttpContext } from '@adonisjs/core/http'

import Genrer from '#models/genrer'

export default class GenrerController {
  async findAll() {
    const genres = await Genrer.all()
    return genres.map((genrer) => genrer.serialize())
  }
}
