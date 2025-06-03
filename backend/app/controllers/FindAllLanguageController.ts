import { inject } from '@adonisjs/core'

import { ILanguageService } from '#services/interfaces/language-service'

@inject()
export default class FindAllLanguageController {
  constructor(private readonly languageService: ILanguageService) {}

  async handle() {
    return await this.languageService.findAll()
  }
}
