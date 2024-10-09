// import type { HttpContext } from '@adonisjs/core/http'

import Genrer from '#models/genrer'
import { ok } from '../helpers/http.js'

export default class GenrerController {
  async findAll() {
    const genres = await Genrer.all()

    return ok(genres.map((genrer) => genrer.serialize()))
  }
}
