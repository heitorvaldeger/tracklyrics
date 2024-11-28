import { inject } from '@adonisjs/core'
import { LanguageProtocolService } from '#services/protocols/language-protocol-service'
import { LanguageFindModel } from '#models/language-model/language-find-model'
import { LanguageRepository } from '#repository/protocols/base-repository'

@inject()
export class LanguageService implements LanguageProtocolService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll(): Promise<LanguageFindModel[]> {
    return await this.languageRepository.findAll()
  }
}
