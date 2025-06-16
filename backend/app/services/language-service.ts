import { inject } from '@adonisjs/core'

import { ILanguageRepository } from '#infra/db/repository/interfaces/language-repository'
import { ILanguageService } from '#services/interfaces/language-service'

@inject()
export class LanguageService implements ILanguageService {
  constructor(private readonly languageRepository: ILanguageRepository) {}

  async findAll() {
    return await this.languageRepository.findAll()
  }
}
