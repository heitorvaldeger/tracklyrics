import { inject } from '@adonisjs/core'

import { LanguageRepository } from '#infra/db/repository/protocols/language-repository'
import { LanguageFindModel } from '#models/language-model/language-find-model'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'

@inject()
export class LanguageService implements LanguageProtocolService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll(): Promise<LanguageFindModel[]> {
    return await this.languageRepository.findAll()
  }
}
