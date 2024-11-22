import { ok } from '#helpers/http'
import { inject } from '@adonisjs/core'
import { ILanguageService } from '#services/interfaces/ILanguageService'

@inject()
export default class LanguageController {
  constructor(private readonly languageService: ILanguageService) {}

  async findAll() {
    const languages = await this.languageService.findAll()

    return ok(languages)
  }
}
