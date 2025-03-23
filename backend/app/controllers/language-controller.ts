import { inject } from '@adonisjs/core'

import { LanguageProtocolService } from '#services/_protocols/language-protocol-service'

@inject()
export default class LanguageController {
  constructor(private readonly languageService: LanguageProtocolService) {}

  async findAll() {
    return await this.languageService.findAll()
  }
}
