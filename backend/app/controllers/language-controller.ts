import { inject } from '@adonisjs/core'

import { ILanguageService } from '#services/interfaces/language-service'

@inject()
export default class LanguageController {
  constructor(private readonly languageService: ILanguageService) {}

  async findAll() {
    return await this.languageService.findAll()
  }
}
