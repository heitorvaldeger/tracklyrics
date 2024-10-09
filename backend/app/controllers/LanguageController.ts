// import type { HttpContext } from '@adonisjs/core/http'

import Language from '#models/language'
import { ok } from '../helpers/http.js'

export default class LanguageController {
  async findAll() {
    const languages = await Language.all()
    return ok(languages.map((language) => language.serialize()))
  }
}
