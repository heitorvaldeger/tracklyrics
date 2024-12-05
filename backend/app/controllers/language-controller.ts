import { inject } from '@adonisjs/core'

import { ok } from '#helpers/http'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'

@inject()
export default class LanguageController {
  constructor(private readonly languageService: LanguageProtocolService) {}

  async findAll() {
    const languages = await this.languageService.findAll()

    return ok(languages)
  }
}
